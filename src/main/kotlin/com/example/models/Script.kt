package com.example.models

import kotlinx.serialization.Serializable
import kotlinx.serialization.Transient

@Serializable
data class Script(
    val id: Int,
    val creatorID: Int,
    val name: String,
    val description: String,
    val inputParams: List<Param>,
    val outputParams: List<Param>,
    @Transient val path: String = ""
)