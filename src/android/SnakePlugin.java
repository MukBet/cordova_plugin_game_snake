package cordova.plugin.snake;

import android.os.Vibrator;
import android.content.Context;

import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONException;
import android.util.Log; // 👈 обязательно импорт
import android.content.pm.PackageManager;
import android.hardware.camera2.CameraManager;

public class SnakePlugin extends CordovaPlugin {
    private static final String TAG = "SnakePlugin";
    
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        Log.d(TAG, "execute called with action: " + action); // ✅ лог при любом вызове
        if ("vibrate".equals(action)) {
            Log.d(TAG, "Vibration requested");
            int duration = args.getInt(0);
            Vibrator vibrator = (Vibrator) cordova.getActivity().getSystemService(Context.VIBRATOR_SERVICE);
            if (vibrator != null) {
                vibrator.vibrate(duration);
                callbackContext.success("Вибрация выполнена");
            } else {
                callbackContext.error("Вибратор не найден");
            }
            return true;
        }
        if ("coolMethod".equals(action)) {
            String arg = args.getString(0); // получаем аргумент
            Log.d("SnakePlugin", "coolMethod вызван с аргументом: " + arg);

            // Здесь можешь делать что угодно, например:
            String result = "Привет из Java, ты передал: " + arg;
            //callbackContext.success(result);

            if (!cordova.getActivity().getPackageManager().hasSystemFeature(PackageManager.FEATURE_CAMERA_FLASH)) {
                Log.d("SnakePlugin", "Фонарик не поддерживается " + arg);
                callbackContext.error("Фонарик не поддерживается");
                return true;
            }

            try {
                CameraManager cameraManager = (CameraManager) cordova.getActivity().getSystemService(Context.CAMERA_SERVICE);
                String cameraId = cameraManager.getCameraIdList()[0];
                Log.d("SnakePlugin", "cameraId:"+cameraId);

                if ("turn-oon-flash".equalsIgnoreCase(arg)) {
                    // Включаем вспышку
                    cameraManager.setTorchMode(cameraId, true);
                    Log.d(TAG, "Фонарик включён на 0.5 сек");

                    // Через 500 мс выключаем
                    new android.os.Handler().postDelayed(() -> {
                        try {
                            cameraManager.setTorchMode(cameraId, false);
                            Log.d(TAG, "Фонарик выключен после задержки");
                        } catch (Exception e) {
                            Log.e(TAG, "Ошибка при отключении фонарика", e);
                        }
                    }, 500);

                    callbackContext.success("Фонарик мигнул");
                    return true;
                }
                else
                {
                    boolean enable = "turn-oon".equalsIgnoreCase(arg);
                    boolean disable = "turn-oof".equalsIgnoreCase(arg);
                    if(enable)
                    {
                        cameraManager.setTorchMode(cameraId, true);
                        Log.d("SnakePlugin", "Фонарик" + (enable ? "включён" : "выключен"));
                    }
                    else if(disable)
                    {
                        cameraManager.setTorchMode(cameraId, false);
                        Log.d("SnakePlugin", "Фонарик" + (!disable ? "включён" : "выключен"));
                    }

                    callbackContext.success("Фонарик " + (enable ? "включён" : "выключен"));
                }
            } catch (Exception e) {
                Log.d("SnakePlugin", "Ошибка при управлении фонариком");
                Log.e("SnakePlugin", "Ошибка при управлении фонариком", e);
                callbackContext.error("Ошибка при управлении фонариком: " + e.getMessage());
            }

            return true;
        }
        return false; // https://cordova.apache.org/docs/en/dev/guide/platforms/android/plugin.html
    }
}
