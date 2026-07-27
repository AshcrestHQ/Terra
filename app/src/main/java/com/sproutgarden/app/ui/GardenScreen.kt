package com.sproutgarden.app.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.LocalFireDepartment
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.sproutgarden.app.data.local.entity.HabitEntity
import io.github.sceneview.Scene
import io.github.sceneview.math.Position
import io.github.sceneview.math.Rotation
import io.github.sceneview.node.ModelNode
import io.github.sceneview.rememberCameraNode
import io.github.sceneview.rememberEngine
import io.github.sceneview.rememberEnvironment
import io.github.sceneview.rememberModelLoader

@Composable
fun GardenScreen(
    viewModel: GardenViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    var showAddDialog by remember { mutableStateOf(false) }

    Box(modifier = Modifier.fillMaxSize()) {
        // 1. 3D Filament Scene Layer (SceneView Compose Engine)
        val engine = rememberEngine()
        val modelLoader = rememberModelLoader(engine)
        val cameraNode = rememberCameraNode(engine).apply {
            position = Position(x = 0f, y = 6f, z = 10f)
            rotation = Rotation(x = -30f, y = 0f, z = 0f)
        }

        val environment = rememberEnvironment(engine) {
            if (uiState.isDayTime) {
                createHDREnvironment("environments/day_sky.hdr")
            } else {
                createHDREnvironment("environments/night_sky.hdr")
            }
        }

        Scene(
            modifier = Modifier.fillMaxSize(),
            engine = engine,
            modelLoader = modelLoader,
            cameraNode = cameraNode,
            environment = environment,
            onTap = { _, _ -> viewModel.selectPlant(null) }
        ) {
            // Render 3D Ground Island Model
            ModelNode(
                modelInstance = modelLoader.createModelInstance("models/floating_island.glb"),
                scaleToUnits = 12.0f
            )

            // Render All 3D Plant Models from Room State
            uiState.plants.forEach { plant ->
                ModelNode(
                    modelInstance = modelLoader.createModelInstance(plant.growthStage.glbFileName),
                    position = Position(x = plant.positionX, y = plant.positionY, z = plant.positionZ),
                    scaleToUnits = plant.growthStage.scaleMultiplier
                ).apply {
                    isEditable = true
                }
            }
        }

        // 2. Modern 2D Glassmorphism Overlay (Material 3 HUD)
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // Top Bar: Title & Day/Night Indicator
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .statusBarsPadding()
                    .background(
                        color = Color(0x800F172A),
                        shape = RoundedCornerShape(24.dp)
                    )
                    .padding(horizontal = 20.dp, vertical = 12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "🌱 Sprout & Flourish",
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp
                )

                Surface(
                    color = Color(0x3334D399),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text(
                        text = if (uiState.isDayTime) "☀️ Day Mode" else "🌙 Night Mode",
                        color = Color(0xFF34D399),
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }

            // Bottom Floating Glassmorphism Habit List Drawer
            Surface(
                modifier = Modifier.fillMaxWidth(),
                color = Color(0xD90F172A),
                shape = RoundedCornerShape(28.dp),
                tonalElevation = 8.dp
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Daily Goals",
                            color = Color.White,
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp
                        )

                        IconButton(
                            onClick = { showAddDialog = true },
                            colors = IconButtonDefaults.iconButtonColors(
                                containerColor = Color(0xFF10B981),
                                contentColor = Color.White
                            )
                        ) {
                            Icon(Icons.Default.Add, contentDescription = "Add Goal")
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    LazyColumn(
                        modifier = Modifier.heightIn(max = 240.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        items(uiState.habits) { habit ->
                            HabitCardItem(
                                habit = habit,
                                onCheckedToggle = { viewModel.onHabitChecked(habit.id) }
                            )
                        }
                    }
                }
            }
        }

        if (showAddDialog) {
            AddHabitDialog(
                onDismiss = { showAddDialog = false },
                onAdd = { title, category ->
                    viewModel.onAddHabit(title, category)
                    showAddDialog = false
                }
            )
        }
    }
}

@Composable
fun HabitCardItem(
    habit: HabitEntity,
    onCheckedToggle: () -> Unit
) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = if (habit.isCompletedToday) Color(0x2610B981) else Color(0x1AFFFFFF),
        shape = RoundedCornerShape(16.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                IconButton(
                    onClick = onCheckedToggle,
                    colors = IconButtonDefaults.iconButtonColors(
                        containerColor = if (habit.isCompletedToday) Color(0xFF10B981) else Color.Transparent,
                        contentColor = Color.White
                    )
                ) {
                    Icon(Icons.Default.Check, contentDescription = "Complete")
                }

                Spacer(modifier = Modifier.width(8.dp))

                Column {
                    Text(
                        text = habit.title,
                        color = Color.White,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 14.sp
                    )
                    Text(
                        text = habit.category,
                        color = Color(0xFF94A3B8),
                        fontSize = 11.sp
                    )
                }
            }

            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    Icons.Default.LocalFireDepartment,
                    contentDescription = "Streak",
                    tint = Color(0xFFF59E0B),
                    modifier = Modifier.size(16.dp)
                )
                Text(
                    text = "${habit.streakCount}d",
                    color = Color(0xFFF59E0B),
                    fontWeight = FontWeight.Bold,
                    fontSize = 12.sp,
                    modifier = Modifier.padding(start = 4.dp)
                )
            }
        }
    }
}

@Composable
fun AddHabitDialog(
    onDismiss: () -> Unit,
    onAdd: (String, String) -> Unit
) {
    var title by remember { mutableStateOf("") }
    var category by remember { mutableStateOf("Health") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Create New Habit Goal", fontWeight = FontWeight.Bold) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = { Text("Habit Title") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = category,
                    onValueChange = { category = it },
                    label = { Text("Category (e.g. Fitness, Health)") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = { if (title.isNotBlank()) onAdd(title, category) },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF10B981))
            ) {
                Text("Plant & Start")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}
