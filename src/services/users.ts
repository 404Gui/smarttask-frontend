import api from './api'

export const getMe = async () => {
  const response = await api.get('/me')
  return response.data
}

export const changeEmail = async (newEmail: string) => {
  await api.put('/change-email', { new_email: newEmail })
}

export const changePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  await api.put('/change-password', {
    current_password: currentPassword,
    new_password: newPassword,
  })
}

export const changeUsername = async (
  newUserName: string
) => {
  await api.put('/change-username', {
    new_username: newUserName,
  })
}

