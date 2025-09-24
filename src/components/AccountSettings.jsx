import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations/translations';
import { supabase } from '../lib/supabase';
import './AccountSettings.css';

const AccountSettings = ({ isOpen, onClose }) => {
  const { user, signOut } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  // Estado del formulario de perfil
  const [profileData, setProfileData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    avatarUrl: user?.user_metadata?.avatar_url || ''
  });

  // Estado del formulario de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profileData.fullName,
          avatar_url: profileData.avatarUrl
        }
      });

      if (error) throw error;

      setMessage({ type: 'success', text: t.profileUpdatedSuccessfully || '¡Perfil actualizado exitosamente!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: t.passwordsDoNotMatch || 'Las contraseñas no coinciden' });
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: t.passwordMinLength || 'La contraseña debe tener al menos 6 caracteres' });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      setMessage({ type: 'success', text: t.passwordUpdatedSuccessfully || '¡Contraseña actualizada exitosamente!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.match('image.*')) {
      setMessage({ type: 'error', text: t.pleaseUploadValidImage || 'Por favor, sube un archivo de imagen válido (JPEG, PNG, etc.)' });
      return;
    }

    // Validar tamaño de archivo (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: t.imageTooLarge || 'La imagen es demasiado grande. El tamaño máximo permitido es de 5MB.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      console.log('Iniciando subida de archivo...');
      
      // 1. Crear un nombre de archivo único
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${user.id}-${Date.now()}.${fileExt}`;
      const filePath = fileName; // Usamos el nombre del archivo directamente en la raíz del bucket

      console.log('Subiendo archivo:', { fileName, filePath, size: file.size, type: file.type });

      // 2. Subir el archivo directamente al bucket 'avatars' sin carpeta
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        console.error('Error al subir el archivo:', uploadError);
        throw uploadError;
      }

      console.log('Archivo subido exitosamente:', uploadData);

      // 3. Obtener la URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('URL pública generada:', publicUrl);

      // 4. Actualizar el perfil del usuario con la nueva URL del avatar
      console.log('Actualizando perfil del usuario...');
      const { data: userData, error: updateError } = await supabase.auth.updateUser({
        data: { 
          ...user.user_metadata,
          avatar_url: publicUrl 
        }
      });

      if (updateError) {
        console.error('Error al actualizar el perfil:', updateError);
        throw updateError;
      }

      console.log('Perfil actualizado exitosamente:', userData);

      // 5. Actualizar el estado local
      setProfileData(prev => ({ 
        ...prev, 
        avatarUrl: publicUrl + '?t=' + Date.now() // Añadir timestamp para evitar caché
      }));
      
      // 6. Forzar actualización del usuario
      const { data: { user: updatedUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error al obtener datos actualizados del usuario:', userError);
        throw userError;
      }
      
      console.log('Usuario actualizado:', updatedUser);
      
      setMessage({ 
        type: 'success', 
        text: t.profilePictureUpdatedSuccessfully || '¡Foto de perfil actualizada correctamente!' 
      });
    } catch (error) {
      console.error('Error en handleAvatarUpload:', error);
      
      let errorMessage = t.errorUploadingImage || 'Error al subir la imagen. Por favor, inténtalo de nuevo.';
      
      if (error.statusCode === 403) {
        errorMessage = t.permissionsError || 'Error de permisos. Asegúrate de que el bucket tenga las políticas de seguridad configuradas correctamente.';
      } else if (error.message.includes('bucket')) {
        errorMessage = t.storageConfigurationError || 'Error de configuración del almacenamiento. Por favor, verifica que el bucket exista y tenga los permisos adecuados.';
      }
      
      setMessage({ 
        type: 'error', 
        text: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    const confirmSignOut = window.confirm(t.confirmSignOut || '¿Estás seguro de que quieres cerrar sesión?');
    if (confirmSignOut) {
      await signOut();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="account-settings-overlay">
      <div className="account-settings-modal">
        <div className="modal-header">
          <h2>{t.accountSettings || 'Configuración de Cuenta'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              👤 {t.profile || 'Perfil'}
            </button>
            <button 
              className={`tab ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              🔒 {t.security || 'Seguridad'}
            </button>
            <button 
              className={`tab ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              ⚙️ {t.account || 'Cuenta'}
            </button>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="tab-content">
              <form onSubmit={handleProfileUpdate}>
                <div className="avatar-section">
                  <div className="avatar-preview">
                    {profileData.avatarUrl ? (
                      <img src={profileData.avatarUrl} alt="Avatar" />
                    ) : (
                      <div className="avatar-placeholder">
                        {profileData.fullName?.charAt(0) || user?.email?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                  >
                    {t.changePhoto || 'Cambiar Foto'}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    style={{ display: 'none' }}
                  />
                </div>

                <div className="form-group">
                  <label>{t.fullName || 'Nombre Completo'}</label>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder={t.yourFullName || 'Tu nombre completo'}
                  />
                </div>

                <div className="form-group">
                  <label>{t.email}</label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="disabled"
                  />
                  <small>{t.emailCannotBeChanged || 'El email no se puede cambiar por razones de seguridad'}</small>
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? (t.saving || 'Guardando...') : (t.saveChanges || 'Guardar Cambios')}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="tab-content">
              <form onSubmit={handlePasswordUpdate}>
                <div className="form-group">
                  <label>{t.newPassword || 'Nueva Contraseña'}</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder={t.newPasswordMinLength || 'Nueva contraseña (mín. 6 caracteres)'}
                    minLength={6}
                  />
                </div>

                <div className="form-group">
                  <label>{t.confirmNewPassword || 'Confirmar Nueva Contraseña'}</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder={t.confirmNewPasswordPlaceholder || 'Confirma tu nueva contraseña'}
                    minLength={6}
                  />
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? (t.updating || 'Actualizando...') : (t.changePassword || 'Cambiar Contraseña')}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="tab-content">
              <div className="account-info">
                <h3>{t.accountInformation || 'Información de la Cuenta'}</h3>
                <p><strong>{t.email}:</strong> {user?.email}</p>
                <p><strong>{t.userId || 'ID de Usuario'}:</strong> {user?.id}</p>
                <p><strong>{t.registrationDate || 'Fecha de Registro'}:</strong> {new Date(user?.created_at).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US')}</p>
              </div>

              <div className="danger-zone">
                <h3>{t.dangerZone || 'Zona de Peligro'}</h3>
                <button 
                  className="btn-danger"
                  onClick={handleSignOut}
                >
                  {t.logout}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
