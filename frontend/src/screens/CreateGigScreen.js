import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../shared/AppText';
import { AppButton } from '../shared/AppButton';
import CategoryChip from '../components/CategoryChip';
import { PackageCard } from '../components/PackageCard';
import { useCategories, useGig, useCreateGig, useUpdateGig } from '../hooks/useGigs';
import { colors, typography, spacing, borderRadius } from '../theme';

const MAX_PACKAGES = 3;

const createEmptyPackage = (name = '') => ({
  name,
  price: '',
  deliveryDays: '',
  features: [],
});

const mapGigToForm = (gig) => ({
  title: gig.title || gig.nombre || '',
  description: gig.description || gig.descripcion || '',
  selectedCategory: gig.category || gig.categoria || '',
  tags: Array.isArray(gig.tags) ? gig.tags.join(', ') : '',
  packages: (gig.packages || gig.paquetes || []).map((p) => ({
    name: p.name || p.nombre || '',
    price: String(p.price ?? p.precio ?? ''),
    deliveryDays: String(p.deliveryDays ?? p.diasEntrega ?? ''),
    features: Array.isArray(p.features) ? p.features : p.caracteristicas || [],
  })),
});

const validateForm = (title, description, selectedCategory, packages) => {
  const errors = { packages: [] };

  if (!title.trim()) errors.title = 'El título es obligatorio.';
  if (!description.trim()) errors.description = 'La descripción es obligatoria.';
  if (!selectedCategory) errors.category = 'Selecciona una categoría.';
  if (packages.length === 0) errors.packagesGeneral = 'Al menos un paquete es requerido.';

  packages.forEach((pkg, i) => {
    const pkgErrors = {};
    if (!pkg.name.trim()) pkgErrors.name = 'El nombre es requerido.';
    const price = Number(pkg.price);
    if (pkg.price === '' || isNaN(price) || price < 0) {
      pkgErrors.price = 'El precio debe ser un número no negativo.';
    }
    const days = Number(pkg.deliveryDays);
    if (pkg.deliveryDays === '' || isNaN(days) || days < 0) {
      pkgErrors.deliveryDays = 'Los días de entrega deben ser un número no negativo.';
    }
    if (!pkg.features || pkg.features.length === 0) {
      pkgErrors.features = 'Cada paquete debe tener al menos una característica.';
    }
    errors.packages[i] = pkgErrors;
  });

  return errors;
};

const formatGigData = (title, description, selectedCategory, tags, packages) => ({
  nombre: title.trim(),
  descripcion: description.trim(),
  categoria: selectedCategory,
  tags: tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean),
  paquetes: packages.map((pkg) => ({
    nombre: pkg.name.trim(),
    precio: Number(pkg.price) || 0,
    diasEntrega: Number(pkg.deliveryDays) || 0,
    caracteristicas: pkg.features,
  })),
});

export function CreateGigScreen({ navigation, route }) {
  const gigId = route.params?.gigId;
  const isEditing = Boolean(gigId);

  const { categories } = useCategories();
  const { gig: existingGig, loading: loadingGig } = useGig(gigId);
  const { createGig, loading: creating } = useCreateGig();
  const { updateGig, loading: updating } = useUpdateGig();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [tags, setTags] = useState('');
  const [packages, setPackages] = useState([createEmptyPackage('Básico')]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (isEditing && existingGig && !initializedRef.current) {
      initializedRef.current = true;
      const form = mapGigToForm(existingGig);
      setTitle(form.title);
      setDescription(form.description);
      setSelectedCategory(form.selectedCategory);
      setTags(form.tags);
      setPackages(form.packages.length > 0 ? form.packages : [createEmptyPackage('Básico')]);
    }
  }, [isEditing, existingGig]);

  const updatePackage = useCallback((index, field, value) => {
    setPackages((prev) => prev.map((pkg, i) => (i === index ? { ...pkg, [field]: value } : pkg)));
    setFieldErrors((prev) => {
      const next = { ...prev, packages: [...(prev.packages || [])] };
      if (next.packages[index]) {
        next.packages[index] = { ...next.packages[index], [field]: undefined };
      }
      return next;
    });
  }, []);

  const addPackage = () => {
    if (packages.length >= MAX_PACKAGES) return;
    const names = ['Básico', 'Estándar', 'Premium'];
    setPackages((prev) => [...prev, createEmptyPackage(names[prev.length] || '')]);
  };

  const removePackage = (index) => {
    if (packages.length <= 1) {
      Alert.alert('Error', 'Debe haber al menos un paquete.');
      return;
    }
    Alert.alert('Eliminar paquete', '¿Estás seguro de que deseas eliminar este paquete?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          setPackages((prev) => prev.filter((_, i) => i !== index));
        },
      },
    ]);
  };

  const handleSubmit = async () => {
    const errors = validateForm(title, description, selectedCategory, packages);
    const hasPackageErrors = errors.packages?.some((e) => e && Object.keys(e).length > 0);
    if (
      errors.title ||
      errors.description ||
      errors.category ||
      errors.packagesGeneral ||
      hasPackageErrors
    ) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setSubmitting(true);
    try {
      const gigData = formatGigData(title, description, selectedCategory, tags, packages);
      if (isEditing) {
        await updateGig(gigId, gigData);
      } else {
        await createGig(gigData);
      }
      Alert.alert('Éxito', isEditing ? 'Servicio actualizado.' : 'Tu servicio ha sido creado.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Error', e.message || 'No se pudo guardar el servicio.');
    } finally {
      setSubmitting(false);
    }
  };

  const isSaving = creating || updating || submitting;

  if (isEditing && loadingGig) {
    return (
      <View style={styles.loadingContainer}>
        <AppText variant="body">Cargando servicio...</AppText>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.content}>
        <AppText variant="subheading" style={styles.sectionTitle}>
          Información básica
        </AppText>

        <View style={styles.field}>
          <AppText variant="caption" style={styles.label}>
            Título del servicio *
          </AppText>
          <TextInput
            style={[styles.input, fieldErrors.title && styles.inputError]}
            placeholder="Ej: Diseño de logo profesional"
            placeholderTextColor={colors.textLight}
            value={title}
            onChangeText={(v) => {
              setTitle(v);
              setFieldErrors((prev) => ({ ...prev, title: undefined }));
            }}
          />
          {fieldErrors.title && (
            <AppText variant="small" style={styles.errorText}>
              {fieldErrors.title}
            </AppText>
          )}
        </View>

        <View style={styles.field}>
          <AppText variant="caption" style={styles.label}>
            Descripción *
          </AppText>
          <TextInput
            style={[styles.input, styles.textArea, fieldErrors.description && styles.inputError]}
            placeholder="Describe tu servicio en detalle..."
            placeholderTextColor={colors.textLight}
            value={description}
            onChangeText={(v) => {
              setDescription(v);
              setFieldErrors((prev) => ({ ...prev, description: undefined }));
            }}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {fieldErrors.description && (
            <AppText variant="small" style={styles.errorText}>
              {fieldErrors.description}
            </AppText>
          )}
        </View>

        <View style={styles.field}>
          <AppText variant="caption" style={styles.label}>
            Categoría *
          </AppText>
          <View style={styles.categoriesGrid}>
            {categories
              .filter((c) => c.id !== 'TODOS')
              .map((category) => (
                <CategoryChip
                  key={category.id}
                  label={category.name}
                  icon={category.icon}
                  selected={selectedCategory === category.id}
                  onPress={() => {
                    setSelectedCategory(category.id);
                    setFieldErrors((prev) => ({ ...prev, category: undefined }));
                  }}
                />
              ))}
          </View>
          {fieldErrors.category && (
            <AppText variant="small" style={styles.errorText}>
              {fieldErrors.category}
            </AppText>
          )}
        </View>

        <View style={styles.field}>
          <AppText variant="caption" style={styles.label}>
            Etiquetas (separadas por coma)
          </AppText>
          <TextInput
            style={styles.input}
            placeholder="Ej: logo, branding, diseño"
            placeholderTextColor={colors.textLight}
            value={tags}
            onChangeText={setTags}
          />
        </View>

        <View style={styles.packagesHeader}>
          <AppText variant="subheading" style={styles.sectionTitle}>
            Paquetes
          </AppText>
          {packages.length < MAX_PACKAGES && (
            <TouchableOpacity onPress={addPackage} style={styles.addPackageBtn}>
              <Ionicons name="add-circle-outline" size={22} color={colors.primary} />
              <AppText variant="caption" style={styles.addPackageText}>
                Agregar paquete
              </AppText>
            </TouchableOpacity>
          )}
        </View>

        {fieldErrors.packagesGeneral && (
          <AppText variant="small" style={[styles.errorText, { marginBottom: spacing.md }]}>
            {fieldErrors.packagesGeneral}
          </AppText>
        )}

        {packages.map((pkg, index) => (
          <PackageCard
            key={index}
            pkg={pkg}
            index={index}
            editable
            errors={fieldErrors.packages?.[index] || {}}
            onUpdate={updatePackage}
            onDelete={removePackage}
            canDelete={packages.length > 1}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <AppButton
          title={isEditing ? 'Guardar cambios' : 'Publicar servicio'}
          onPress={handleSubmit}
          loading={isSaving}
          style={styles.submitBtn}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: spacing.lg,
  },
  sectionTitle: {
    color: colors.text,
    marginBottom: spacing.md,
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputError: {
    borderColor: colors.error,
  },
  textArea: {
    height: 120,
    paddingTop: spacing.md,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  packagesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  addPackageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addPackageText: {
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  errorText: {
    color: colors.error,
    marginTop: spacing.xs,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  submitBtn: {
    width: '100%',
  },
});
