import {Alert} from 'react-native';

export function showSuccess(message: string, title = 'Tudo certo!') {
  Alert.alert(title, message);
}

export function showError(message: string, title = 'Atenção') {
  Alert.alert(title, message);
}

export function showInfo(message: string, title = 'Informação') {
  Alert.alert(title, message);
}

export function confirmAction(
  title: string,
  message: string,
  onConfirm: () => void,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
) {
  Alert.alert(title, message, [
    {text: cancelText, style: 'cancel'},
    {text: confirmText, style: 'destructive', onPress: onConfirm},
  ]);
}
