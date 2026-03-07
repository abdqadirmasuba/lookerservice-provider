// File: src/utils/alerts.ts

import { Alert, AlertButton, Platform } from 'react-native';

/**
 * IMPORTANT: These are legacy alert functions using React Native's default Alert.
 * 
 * For better UI/UX, consider using the CustomAlert component:
 * 
 * import { useCustomAlert } from '@/src/components/common/CustomAlert';
 * 
 * const { showAlert, AlertComponent } = useCustomAlert();
 * 
 * // Then in your JSX
 * return (
 *   <View>
 *     {/* Your content *\/}
 *     {AlertComponent}
 *   </View>
 * );
 * 
 * // To show an alert:
 * showAlert({
 *   type: 'success' | 'error' | 'warning' | 'info',
 *   title: 'Title',
 *   message: 'Message',
 *   buttons: [{ text: 'OK', style: 'default', onPress: () => {} }],
 * });
 */

/**
 * Shows a success alert
 * @param title - Alert title
 * @param message - Alert message
 * @param onPress - Optional callback when OK is pressed
 */
export const showSuccessAlert = (
  title: string,
  message?: string,
  onPress?: () => void
) => {
  Alert.alert(
    `✅ ${title}`,
    message,
    [
      {
        text: 'OK',
        onPress: onPress,
        style: 'default',
      },
    ],
    { cancelable: false }
  );
};

/**
 * Shows an error alert
 * @param title - Alert title
 * @param message - Alert message
 * @param onPress - Optional callback when OK is pressed
 */
export const showErrorAlert = (
  title: string,
  message?: string,
  onPress?: () => void
) => {
  Alert.alert(
    `❌ ${title}`,
    message,
    [
      {
        text: 'OK',
        onPress: onPress,
        style: 'default',
      },
    ],
    { cancelable: false }
  );
};

/**
 * Shows a warning alert
 * @param title - Alert title
 * @param message - Alert message
 * @param onPress - Optional callback when OK is pressed
 */
export const showWarningAlert = (
  title: string,
  message?: string,
  onPress?: () => void
) => {
  Alert.alert(
    `⚠️ ${title}`,
    message,
    [
      {
        text: 'OK',
        onPress: onPress,
        style: 'default',
      },
    ],
    { cancelable: false }
  );
};

/**
 * Shows an info alert
 * @param title - Alert title
 * @param message - Alert message
 * @param onPress - Optional callback when OK is pressed
 */
export const showInfoAlert = (
  title: string,
  message?: string,
  onPress?: () => void
) => {
  Alert.alert(
    `ℹ️ ${title}`,
    message,
    [
      {
        text: 'OK',
        onPress: onPress,
        style: 'default',
      },
    ],
    { cancelable: false }
  );
};

/**
 * Shows a confirmation alert with Cancel and Confirm buttons
 * @param title - Alert title
 * @param message - Alert message
 * @param onConfirm - Callback when Confirm is pressed
 * @param onCancel - Optional callback when Cancel is pressed
 * @param confirmText - Custom confirm button text (default: "Confirm")
 * @param cancelText - Custom cancel button text (default: "Cancel")
 * @param destructive - Whether the confirm action is destructive (default: false)
 */
export const showConfirmAlert = (
  title: string,
  message?: string,
  onConfirm?: () => void,
  onCancel?: () => void,
  confirmText: string = 'Confirm',
  cancelText: string = 'Cancel',
  destructive: boolean = false
) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: cancelText,
        onPress: onCancel,
        style: 'cancel',
      },
      {
        text: confirmText,
        onPress: onConfirm,
        style: destructive ? 'destructive' : 'default',
      },
    ],
    { cancelable: false }
  );
};

/**
 * Shows a validation error alert
 * @param message - Error message
 */
export const showValidationError = (message: string) => {
  showErrorAlert('Validation Error', message);
};

/**
 * Shows a network error alert
 * @param message - Optional custom message
 */
export const showNetworkError = (message?: string) => {
  showErrorAlert(
    'Network Error',
    message || 'Please check your internet connection and try again.'
  );
};

/**
 * Shows a custom alert with multiple buttons
 * @param title - Alert title
 * @param message - Alert message
 * @param buttons - Array of alert buttons
 * @param cancelable - Whether alert can be dismissed by tapping outside (Android only)
 */
export const showCustomAlert = (
  title: string,
  message?: string,
  buttons?: AlertButton[],
  cancelable: boolean = false
) => {
  Alert.alert(title, message, buttons, { cancelable });
};

/**
 * Shows a delete confirmation alert
 * @param itemName - Name of the item being deleted
 * @param onConfirm - Callback when delete is confirmed
 */
export const showDeleteConfirm = (
  itemName: string,
  onConfirm: () => void
) => {
  showConfirmAlert(
    'Delete Confirmation',
    `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
    onConfirm,
    undefined,
    'Delete',
    'Cancel',
    true
  );
};

/**
 * Shows a logout confirmation alert
 * @param onConfirm - Callback when logout is confirmed
 */
export const showLogoutConfirm = (onConfirm: () => void) => {
  showConfirmAlert(
    'Logout',
    'Are you sure you want to logout?',
    onConfirm,
    undefined,
    'Logout',
    'Cancel',
    false
  );
};

/**
 * Shows a required field alert
 * @param fieldName - Name of the required field
 */
export const showRequiredFieldAlert = (fieldName: string) => {
  showValidationError(`${fieldName} is required. Please fill in this field.`);
};

/**
 * Shows an invalid format alert
 * @param fieldName - Name of the field with invalid format
 * @param expectedFormat - Expected format description
 */
export const showInvalidFormatAlert = (
  fieldName: string,
  expectedFormat?: string
) => {
  const message = expectedFormat
    ? `${fieldName} format is invalid. Expected format: ${expectedFormat}`
    : `${fieldName} format is invalid. Please check and try again.`;
  showValidationError(message);
};

/**
 * Shows a save confirmation alert
 * @param onConfirm - Callback when save is confirmed
 * @param hasUnsavedChanges - Whether there are unsaved changes
 */
export const showSaveConfirm = (
  onConfirm: () => void,
  hasUnsavedChanges: boolean = true
) => {
  if (!hasUnsavedChanges) {
    onConfirm();
    return;
  }

  showConfirmAlert(
    'Save Changes',
    'Do you want to save your changes?',
    onConfirm,
    undefined,
    'Save',
    'Cancel',
    false
  );
};

/**
 * Shows a discard changes alert
 * @param onDiscard - Callback when discard is confirmed
 */
export const showDiscardChangesAlert = (onDiscard: () => void) => {
  showConfirmAlert(
    'Discard Changes',
    'You have unsaved changes. Are you sure you want to discard them?',
    onDiscard,
    undefined,
    'Discard',
    'Keep Editing',
    true
  );
};