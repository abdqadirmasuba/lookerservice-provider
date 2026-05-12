// File: src/components/common/CustomAlert.tsx

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from 'react-native-heroicons/outline';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface CustomAlertProps {
  visible: boolean;
  type?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  buttons?: AlertButton[];
  onClose?: () => void;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  type = 'info',
  title,
  message,
  buttons = [{ text: 'OK', style: 'default' }],
  onClose,
}) => {
  const scaleValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      scaleValue.setValue(0);
    }
  }, [visible]);

  const getIcon = () => {
    const iconSize = 48;
    switch (type) {
      case 'success':
        return <CheckCircleIcon size={iconSize} color="#10B981" />;
      case 'error':
        return <XCircleIcon size={iconSize} color="#EF4444" />;
      case 'warning':
        return <ExclamationTriangleIcon size={iconSize} color="#F59E0B" />;
      case 'info':
      default:
        return <InformationCircleIcon size={iconSize} color="#2DA9E9" />;
    }
  };

  const getIconBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 dark:bg-green-900/20';
      case 'error':
        return 'bg-red-100 dark:bg-red-900/20';
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900/20';
      case 'info':
      default:
        return 'bg-blue-100 dark:bg-blue-900/20';
    }
  };

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1 bg-black/50 items-center justify-center px-6">
        <Animated.View
          style={{
            transform: [{ scale: scaleValue }],
          }}
          className="w-full max-w-sm bg-white dark:bg-[#1E293B] rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Icon */}
          <View className="items-center pt-8 pb-4">
            <View className={`w-20 h-20 rounded-full items-center justify-center ${getIconBgColor()}`}>
              {getIcon()}
            </View>
          </View>

          {/* Content */}
          <View className="px-6 pb-6">
            <Text className="text-xl font-bold text-gray-900 dark:text-white text-center mb-3">
              {title}
            </Text>
            <Text className="text-base text-gray-600 dark:text-gray-400 text-center leading-6">
              {message}
            </Text>
          </View>

          {/* Buttons */}
          <View className="border-t border-gray-200 dark:border-[#334155]">
            {buttons.length === 1 ? (
              <TouchableOpacity
                onPress={() => handleButtonPress(buttons[0])}
                className="py-4"
                activeOpacity={0.7}
              >
                <Text
                  className={`text-center font-bold text-base ${
                    buttons[0].style === 'destructive'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-primary-500'
                  }`}
                >
                  {buttons[0].text}
                </Text>
              </TouchableOpacity>
            ) : (
              <View className="flex-row">
                {buttons.map((button, index) => (
                  <React.Fragment key={index}>
                    <TouchableOpacity
                      onPress={() => handleButtonPress(button)}
                      className="flex-1 py-4"
                      activeOpacity={0.7}
                    >
                      <Text
                        className={`text-center font-bold text-base ${
                          button.style === 'cancel'
                            ? 'text-gray-500 dark:text-gray-400'
                            : button.style === 'destructive'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-primary-500'
                        }`}
                      >
                        {button.text}
                      </Text>
                    </TouchableOpacity>
                    {index < buttons.length - 1 && (
                      <View className="w-px bg-gray-200 dark:bg-[#334155]" />
                    )}
                  </React.Fragment>
                ))}
              </View>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// Hook for easy usage
export const useCustomAlert = () => {
  const [alertConfig, setAlertConfig] = React.useState<CustomAlertProps>({
    visible: false,
    title: '',
    message: '',
    type: 'info',
    buttons: [],
  });

  const showAlert = (config: Omit<CustomAlertProps, 'visible' | 'onClose'>) => {
    setAlertConfig({
      ...config,
      visible: true,
      onClose: () => setAlertConfig((prev) => ({ ...prev, visible: false })),
    });
  };

  const hideAlert = () => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  };

  return {
    alertConfig,
    showAlert,
    hideAlert,
    AlertComponent: <CustomAlert {...alertConfig} />,
  };
};
