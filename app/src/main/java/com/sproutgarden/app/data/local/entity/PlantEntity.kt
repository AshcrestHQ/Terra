package com.sproutgarden.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

enum class PlantGrowthStage(val glbFileName: String, val scaleMultiplier: Float) {
    SEED("models/seed.glb", 0.4f),
    SPROUT("models/sprout.glb", 0.7f),
    SAPLING("models/sapling.glb", 1.0f),
    MATURE("models/mature_tree.glb", 1.3f),
    BLOOMING("models/blooming_tree.glb", 1.6f);

    companion object {
        fun fromStreak(streak: Int): PlantGrowthStage = when {
            streak >= 30 -> BLOOMING
            streak >= 14 -> MATURE
            streak >= 7  -> SAPLING
            streak >= 3  -> SPROUT
            else         -> SEED
        }
    }
}

@Entity(tableName = "plants")
data class PlantEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val speciesName: String,
    val growthStage: PlantGrowthStage = PlantGrowthStage.SEED,
    val positionX: Float,
    val positionY: Float = 0f,
    val positionZ: Float,
    val totalWaterCount: Int = 0,
    val healthPercentage: Int = 100
)
