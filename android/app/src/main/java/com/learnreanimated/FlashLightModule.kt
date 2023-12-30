package com.learnreanimated

import android.content.Context
import android.hardware.camera2.CameraAccessException
import android.hardware.camera2.CameraManager
import android.util.Log
import com.facebook.react.bridge.*
import kotlinx.coroutines.*
import com.facebook.react.modules.core.DeviceEventManagerModule


class FlashLightModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    var flashLightStatus: Boolean = false
    private val viewModelJob = Job()
    protected var scope = CoroutineScope(
        viewModelJob + Dispatchers.Main
    )
    var currentLetter = ' '
    override fun getName() = "FlashLightModule"

    @ReactMethod fun turnOnFlashLight(text: String) {
        blinkFlashLight(text)
    }

    @ReactMethod fun interruptBlinking() {
        scope.cancel()
        turnOffTorch()
        scope = CoroutineScope(Job() + Dispatchers.Main)
    }

    private var listenerCount = 0

    @ReactMethod
    fun addListener(eventName: String) {
        if (listenerCount == 0) {
            // Set up any upstream listeners or background tasks as necessary
        }

        listenerCount += 1
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        listenerCount -= count
        if (listenerCount == 0) {
            // Remove upstream listeners, stop unnecessary background tasks
        }
    }

    private fun sendLetter(reactContext: ReactContext, letter: Char) {
        val params = Arguments.createMap().apply {
            putString("eventProperty", letter.toString())
        }
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("sendLetter", params)
    }

//    @ReactMethod suspend fun showLetter(): Char {
//
//    }
//
//    suspend fun testCoroutineLetter(): Char = coroutineScope {
//        delay(2000)
//        't'
//    }

    private fun blinkFlashLight(text: String) {
        scope.launch {
            for (letter in text.lowercase()) {
                sendLetter(reactContext, letter)
                letterHandler(letter)
            }
        }

    }

    suspend fun letterHandler(letter: Char) {
        if (letter === ' ') {
            delay(Delays.SPACE.value)
            return
        }
        val morseList = morseDictionary[letter]
        if (morseList !== null && morseList.isNotEmpty()) {
            for (symbol in morseList) {
                currentLetter = letter
                if (symbol === MorseSymbols.DOT) {
                    turnOnTorch()
                    delay(Delays.DOT_DELAY.value)
                    turnOffTorch()
                    delay(Delays.AFTER_DOT_DELAY.value)
                } else if (symbol === MorseSymbols.DASH) {
                    turnOnTorch()
                    delay(Delays.DASH_DELAY.value)
                    turnOffTorch()
                    delay(Delays.AFTER_DASH_DELAY.value)
                }
            }
            delay(Delays.DELAY_AFTER_LETTER.value)
        }
    }

    private fun turnOnTorch() {
        val cameraManager = currentActivity?.getSystemService(Context.CAMERA_SERVICE) as CameraManager
        val cameraId = cameraManager.cameraIdList[0]
        if (!flashLightStatus) {
            try {
                cameraManager.setTorchMode(cameraId, true)
                flashLightStatus = true

            } catch (e: CameraAccessException) {
                Log.d("MAct", "Turn on torch error ${e.message}")
            }
        }
    }

    private fun turnOffTorch() {
        val cameraManager = currentActivity?.getSystemService(Context.CAMERA_SERVICE) as CameraManager
        val cameraId = cameraManager.cameraIdList[0]
        if (flashLightStatus) {
            try {
                cameraManager.setTorchMode(cameraId, false)
                flashLightStatus = false

            } catch (e: CameraAccessException) {
                Log.d("MAct", "Turn off torch error ${e.message}")
            }
        }
    }
}