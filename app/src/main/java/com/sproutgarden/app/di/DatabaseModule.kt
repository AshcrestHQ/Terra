package com.sproutgarden.app.di

import android.content.Context
import androidx.room.Room
import com.sproutgarden.app.data.local.GardenDatabase
import com.sproutgarden.app.data.local.dao.HabitDao
import com.sproutgarden.app.data.local.dao.PlantDao
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideGardenDatabase(
        @ApplicationContext context: Context
    ): GardenDatabase {
        return Room.databaseBuilder(
            context,
            GardenDatabase::class.java,
            "garden_db"
        ).fallbackToDestructiveMigration().build()
    }

    @Provides
    fun provideHabitDao(db: GardenDatabase): HabitDao = db.habitDao()

    @Provides
    fun providePlantDao(db: GardenDatabase): PlantDao = db.plantDao()
}
