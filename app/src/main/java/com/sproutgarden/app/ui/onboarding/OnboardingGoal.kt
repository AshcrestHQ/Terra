package com.sproutgarden.app.ui.onboarding

enum class OnboardingGoal(
    val title: String,
    val description: String,
    val iconEmoji: String,
    val presetHabits: List<Pair<String, String>>
) {
    LOSE_WEIGHT(
        title = "Lose Weight",
        description = "Burn calories, build consistency, and boost energy.",
        iconEmoji = "🔥",
        presetHabits = listOf(
            "10,000 Daily Steps" to "Fitness",
            "Caloric Deficit Goal" to "Health",
            "Drink 2.5L Water" to "Health",
            "30 Min Cardio Workout" to "Fitness"
        )
    ),
    STAY_HEALTHY(
        title = "Stay Healthy",
        description = "Nurture mental clarity, sleep, and overall wellness.",
        iconEmoji = "🌿",
        presetHabits = listOf(
            "15 Min Meditation" to "Mindfulness",
            "Sleep Before 11 PM" to "Health",
            "Read 15 Pages" to "Learning",
            "Eat 2 Serving Vegetables" to "Health"
        )
    ),
    GAIN_MUSCLE(
        title = "Gain Muscle",
        description = "Optimize strength, protein intake, and heavy lifting.",
        iconEmoji = "💪",
        presetHabits = listOf(
            "Hit Daily Protein Target" to "Health",
            "Heavy Strength Training" to "Fitness",
            "8 Hours Recovery Sleep" to "Health",
            "Track Calorie Surplus" to "Health"
        )
    )
}
