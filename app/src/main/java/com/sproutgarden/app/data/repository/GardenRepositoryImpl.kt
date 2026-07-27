package com.sproutgarden.app.data.repository

import com.sproutgarden.app.data.local.dao.HabitDao
import com.sproutgarden.app.data.local.dao.PlantDao
import com.sproutgarden.app.data.local.entity.HabitEntity
import com.sproutgarden.app.data.local.entity.PlantEntity
import com.sproutgarden.app.data.local.entity.PlantGrowthStage
import com.sproutgarden.app.data.remote.FirestoreSyncService
import com.sproutgarden.app.ui.onboarding.OnboardingGoal
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import java.time.LocalDate
import java.time.temporal.ChronoUnit
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class GardenRepositoryImpl @Inject constructor(
    private val habitDao: HabitDao,
    private val plantDao: PlantDao,
    private val syncService: FirestoreSyncService
) {
    fun getHabits(): Flow<List<HabitEntity>> = habitDao.getAllHabits()
    fun getPlants(): Flow<List<PlantEntity>> = plantDao.getAllPlants()

    suspend fun populateInitialHabitsForGoal(goal: OnboardingGoal) {
        goal.presetHabits.forEachIndexed { index, (title, category) ->
            val posX = (index % 2) * 2.0f - 1.0f
            val posZ = (index / 2) * 2.0f - 1.0f

            val plant = PlantEntity(
                speciesName = "Sakura Bonsai",
                growthStage = PlantGrowthStage.SEED,
                positionX = posX,
                positionZ = posZ
            )
            val plantId = plantDao.insertPlant(plant)

            val habit = HabitEntity(
                title = title,
                category = category,
                assignedPlantId = plantId
            )
            habitDao.insertHabit(habit)
        }
        syncToCloud()
    }

    suspend fun createHabitWithPlant(title: String, category: String, posX: Float, posZ: Float) {
        val newPlant = PlantEntity(
            speciesName = "Sakura Bonsai",
            growthStage = PlantGrowthStage.SEED,
            positionX = posX,
            positionZ = posZ
        )
        val plantId = plantDao.insertPlant(newPlant)

        val newHabit = HabitEntity(
            title = title,
            category = category,
            assignedPlantId = plantId
        )
        habitDao.insertHabit(newHabit)
        syncToCloud()
    }

    suspend fun toggleHabitCompletion(habitId: Long) {
        val habit = habitDao.getHabitById(habitId) ?: return
        val today = LocalDate.now()
        val isCompleting = !habit.isCompletedToday

        val newStreak = if (isCompleting) {
            val lastDate = habit.lastCompletedDate?.let { LocalDate.parse(it) }
            val diff = lastDate?.let { ChronoUnit.DAYS.between(it, today) } ?: -1
            if (diff == 1L || lastDate == null) habit.streakCount + 1 else 1
        } else {
            maxOf(0, habit.streakCount - 1)
        }

        val updatedHabit = habit.copy(
            isCompletedToday = isCompleting,
            streakCount = newStreak,
            longestStreak = maxOf(habit.longestStreak, newStreak),
            lastCompletedDate = if (isCompleting) today.toString() else habit.lastCompletedDate
        )
        habitDao.updateHabit(updatedHabit)

        habit.assignedPlantId?.let { plantId ->
            val plant = plantDao.getPlantById(plantId) ?: return@let
            val updatedPlant = plant.copy(
                growthStage = PlantGrowthStage.fromStreak(newStreak),
                totalWaterCount = plant.totalWaterCount + 1
            )
            plantDao.updatePlant(updatedPlant)
        }

        syncToCloud()
    }

    suspend fun syncCloudToLocal() {
        try {
            val result = syncService.pullCloudDataToLocal() ?: return
            val (habits, plants) = result
            habits.forEach { habitDao.insertHabit(it) }
            plants.forEach { plantDao.insertPlant(it) }
        } catch (_: Exception) {
            // Room DB single source of truth fallback
        }
    }

    private suspend fun syncToCloud() {
        val currentHabits = habitDao.getAllHabits().first()
        val currentPlants = plantDao.getAllPlants().first()
        try {
            syncService.pushLocalDataToCloud(currentHabits, currentPlants)
        } catch (_: Exception) {
            // Retains Room offline-first persistence if device is offline
        }
    }
}
