package com.sproutgarden.app.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.sproutgarden.app.data.local.entity.PlantEntity
import com.sproutgarden.app.data.repository.GardenRepositoryImpl
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.time.LocalTime
import javax.inject.Inject

@HiltViewModel
class GardenViewModel @Inject constructor(
    private val repository: GardenRepositoryImpl
) : ViewModel() {

    private val _selectedPlant = MutableStateFlow<PlantEntity?>(null)

    val uiState: StateFlow<GardenUiState> = combine(
        repository.getHabits(),
        repository.getPlants(),
        _selectedPlant
    ) { habits, plants, selectedPlant ->
        val currentHour = LocalTime.now().hour
        val isDay = currentHour in 6..18

        GardenUiState(
            habits = habits,
            plants = plants,
            isDayTime = isDay,
            selectedPlant = selectedPlant,
            isLoading = false
        )
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = GardenUiState(isLoading = true)
    )

    fun onHabitChecked(habitId: Long) {
        viewModelScope.launch {
            repository.toggleHabitCompletion(habitId)
        }
    }

    fun onAddHabit(title: String, category: String) {
        viewModelScope.launch {
            val count = uiState.value.plants.size
            val posX = (count % 3) * 1.5f - 1.5f
            val posZ = (count / 3) * 1.5f - 1.5f
            repository.createHabitWithPlant(title, category, posX, posZ)
        }
    }

    fun selectPlant(plant: PlantEntity?) {
        _selectedPlant.value = plant
    }
}
