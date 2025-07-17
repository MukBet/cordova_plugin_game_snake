package cordova.plugin.snake;

import android.os.Vibrator;
import android.content.Context;

import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONException;
import android.util.Log; // 👈 обязательно импорт

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
        return false;
    }
}
