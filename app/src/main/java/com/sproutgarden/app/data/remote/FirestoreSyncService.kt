package com.sproutgarden.app.data.remote

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.sproutgarden.app.data.local.entity.HabitEntity
import com.sproutgarden.app.data.local.entity.PlantEntity
import com.sproutgarden.app.data.local.entity.PlantGrowthStage
import kotlinx.coroutines.tasks.await
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class FirestoreSyncService @Inject constructor(
    private val firestore: FirebaseFirestore,
    private val auth: FirebaseAuth
) {
    private val userId: String? get() = auth.currentUser?.uid

    suspend fun pushLocalDataToCloud(habits: List<HabitEntity>, plants: List<PlantEntity>) {
        val uid = userId ?: return
        val userDoc = firestore.collection("users").document(uid)

        val habitData = habits.map { h ->
            mapOf(
                "id" to h.id,
                "title" to h.title,
                "category" to h.category,
                "streakCount" to h.streakCount,
                "longestStreak" to h.longestStreak,
                "lastCompletedDate" to h.lastCompletedDate,
                "assignedPlantId" to h.assignedPlantId,
                "isCompletedToday" to h.isCompletedToday
            )
        }

        val plantData = plants.map { p ->
            mapOf(
                "id" to p.id,
                "speciesName" to p.speciesName,
                "growthStage" to p.growthStage.name,
                "positionX" to p.positionX,
                "positionY" to p.positionY,
                "positionZ" to p.positionZ,
                "totalWaterCount" to p.totalWaterCount
            )
        }

        val payload = mapOf(
            "lastSyncedAt" to System.currentTimeMillis(),
            "habits" to habitData,
            "plants" to plantData
        )

        userDoc.set(payload).await()
    }

    @Suppress("UNCHECKED_CAST")
    suspend fun pullCloudDataToLocal(): Pair<List<HabitEntity>, List<PlantEntity>>? {
        val uid = userId ?: return null
        val doc = firestore.collection("users").document(uid).get().await()

        if (!doc.exists()) return null

        val habitsList = (doc.get("habits") as? List<Map<String, Any>>)?.map { map ->
            HabitEntity(
                id = (map["id"] as Long),
                title = map["title"] as String,
                category = map["category"] as String,
                streakCount = (map["streakCount"] as Long).toInt(),
                longestStreak = (map["longestStreak"] as Long).toInt(),
                lastCompletedDate = map["lastCompletedDate"] as? String,
                assignedPlantId = map["assignedPlantId"] as? Long,
                isCompletedToday = map["isCompletedToday"] as Boolean
            )
        } ?: emptyList()

        val plantsList = (doc.get("plants") as? List<Map<String, Any>>)?.map { map ->
            PlantEntity(
                id = (map["id"] as Long),
                speciesName = map["speciesName"] as String,
                growthStage = PlantGrowthStage.valueOf(map["growthStage"] as String),
                positionX = (map["positionX"] as Double).toFloat(),
                positionY = (map["positionY"] as Double).toFloat(),
                positionZ = (map["positionZ"] as Double).toFloat(),
                totalWaterCount = (map["totalWaterCount"] as Long).toInt()
            )
        } ?: emptyList()

        return Pair(habitsList, plantsList)
    }
}
