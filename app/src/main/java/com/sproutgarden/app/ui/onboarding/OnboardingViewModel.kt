package com.sproutgarden.app.ui.onboarding

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.sproutgarden.app.data.repository.GardenRepositoryImpl
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class OnboardingViewModel @Inject constructor(
    private val repository: GardenRepositoryImpl
) : ViewModel() {

    private val _selectedGoal = MutableStateFlow<OnboardingGoal?>(null)
    val selectedGoal: StateFlow<OnboardingGoal?> = _selectedGoal

    fun selectGoal(goal: OnboardingGoal) {
        _selectedGoal.value = goal
    }

    fun completeOnboarding(onSuccess: () -> Unit) {
        val goal = _selectedGoal.value ?: return
        viewModelScope.launch {
            repository.populateInitialHabitsForGoal(goal)
            onSuccess()
        }
    }
}
