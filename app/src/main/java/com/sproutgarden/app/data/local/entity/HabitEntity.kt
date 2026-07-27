package com.sproutgarden.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "habits")
data class HabitEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val title: String,
    val category: String,
    val streakCount: Int = 0,
    val longestStreak: Int = 0,
    val lastCompletedDate: String? = null,
    val assignedPlantId: Long? = null,
    val isCompletedToday: Boolean = false
)
