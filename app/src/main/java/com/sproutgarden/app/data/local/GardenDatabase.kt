package com.sproutgarden.app.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import com.sproutgarden.app.data.local.dao.HabitDao
import com.sproutgarden.app.data.local.dao.PlantDao
import com.sproutgarden.app.data.local.entity.HabitEntity
import com.sproutgarden.app.data.local.entity.PlantEntity

@Database(
    entities = [HabitEntity::class, PlantEntity::class],
    version = 1,
    exportSchema = false
)
abstract class GardenDatabase : RoomDatabase() {
    abstract fun habitDao(): HabitDao
    abstract fun plantDao(): PlantDao
}
