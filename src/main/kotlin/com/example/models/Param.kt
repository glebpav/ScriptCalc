package com.example.models

import kotlinx.serialization.Serializable

@Serializable
data class Param (
    var paramName: String,
    var unit: String,
    var value: String = ""
)