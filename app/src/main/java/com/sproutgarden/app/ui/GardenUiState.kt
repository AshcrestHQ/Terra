package com.sproutgarden.app.ui

import com.sproutgarden.app.data.local.entity.HabitEntity
import com.sproutgarden.app.data.local.entity.PlantEntity

data class GardenUiState(
    val habits: List<HabitEntity> = emptyList(),
    val plants: List<PlantEntity> = emptyList(),
    val isDayTime: Boolean = true,
    val selectedPlant: PlantEntity? = null,
    val isLoading: Boolean = false
)
