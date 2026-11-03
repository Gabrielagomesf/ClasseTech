import {getFeedbackApi} from '../components/feedback/FeedbackProvider';
import {Alert} from 'react-native';

function api() {
  return getFeedbackApi();
}

function fallbackAlert(title: string, message: string) {
  Alert.alert(title, message);
}

export function showSuccess(message: string, title = 'Sucesso') {
  api()?.showSuccess(message, title) ?? fallbackAlert(title, message);
}

export function showError(message: string, title = 'Erro') {
  api()?.showError(message, title) ?? fallbackAlert(title, message);
}

export function showWarning(message: string, title = 'Atenção') {
  api()?.showWarning(message, title) ?? fallbackAlert(title, message);
}

export function showInfo(message: string, title = 'Informação') {
  api()?.showInfo(message, title) ?? fallbackAlert(title, message);
}

export function confirmAction(
  title: string,
  message: string,
  onConfirm: () => void,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
) {
  const feedback = api();
  if (feedback) {
    feedback.confirmAction(
      title,
      message,
      onConfirm,
      confirmText,
      cancelText,
      confirmText.toLowerCase().includes('limpar') ||
        confirmText.toLowerCase().includes('excluir'),
    );
    return;
  }
  Alert.alert(title, message, [
    {text: cancelText, style: 'cancel'},
    {text: confirmText, style: 'destructive', onPress: onConfirm},
  ]);
}
