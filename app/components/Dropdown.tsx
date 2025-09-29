import React, { useEffect, useMemo, useState } from 'react';
import {
    FlatList,
    GestureResponderEvent,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

// A flexible, well-typed React Native Dropdown component (TypeScript)
// Props explained below — safe defaults included.

export type Option<T = any> = {
  /** unique id for the option */
  id: string | number;
  /** label shown to the user */
  label: string;
  /** arbitrary value the option represents */
  value: T;
  /** optional extra data */
  [key: string]: any;
};

export type DropdownProps<T = any> = {
  options: Option<T>[];
  value?: Option<T> | Option<T>[] | null;
  onChange?: (selected: Option<T> | Option<T>[] | null) => void;
  placeholder?: string;
  disabled?: boolean;
  /** allow searching inside the dropdown */
  searchable?: boolean;
  /** allow selecting multiple items */
  multi?: boolean;
  /** show a checkbox / bullet for selected items (visual only) */
  showSelectionIndicator?: boolean;
  style?: ViewStyle;
  dropdownStyle?: ViewStyle;
  itemStyle?: ViewStyle;
  labelStyle?: TextStyle;
  placeholderStyle?: TextStyle;
  /** customize how an option label is derived */
  labelExtractor?: (option: Option<T>) => string;
  /** customize how option key is derived */
  keyExtractor?: (option: Option<T>) => string | number;
  /** optional render function for list item */
  renderItem?: (option: Option<T>, selected: boolean) => React.ReactNode;
  /** maximum height for dropdown list */
  maxDropdownHeight?: number;
  /** modal presentation on iOS/Android */
  useModal?: boolean;
  testID?: string;
};

function defaultKeyExtractor<T>(o: Option<T>) {
  return o.id;
}

function defaultLabelExtractor<T>(o: Option<T>) {
  return o.label ?? String(o.value);
}

export default function Dropdown<T = any>(props: DropdownProps<T>) {
  const {
    options,
    value = null,
    onChange,
    placeholder = 'Select...',
    disabled = false,
    searchable = false,
    multi = false,
    showSelectionIndicator = true,
    style,
    dropdownStyle,
    itemStyle,
    labelStyle,
    placeholderStyle,
    labelExtractor = defaultLabelExtractor,
    keyExtractor = defaultKeyExtractor,
    renderItem,
    maxDropdownHeight = 300,
    useModal = true,
    testID,
  } = props;

  // internal state
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Option<T> | Option<T>[] | null>(value ?? null);

  useEffect(() => {
    // Keep internal selected in sync when parent changes the `value` prop
    setSelected(value ?? null);
  }, [value]);

  const flatOptions = useMemo(() => {
    if (!query) return options;
    const q = query.trim().toLowerCase();
    return options.filter((o) => labelExtractor(o).toLowerCase().includes(q));
  }, [options, query, labelExtractor]);

  function isSelected(opt: Option<T>) {
    if (multi) {
      return Array.isArray(selected) && selected.some((s) => keyExtractor(s) === keyExtractor(opt));
    }
    return selected !== null && !Array.isArray(selected) && keyExtractor(selected as Option<T>) === keyExtractor(opt);
  }

  function handleSelect(opt: Option<T>) {
    if (disabled) return;

    if (multi) {
      const arr = Array.isArray(selected) ? [...selected] : [];
      const idx = arr.findIndex((s) => keyExtractor(s) === keyExtractor(opt));
      if (idx >= 0) arr.splice(idx, 1);
      else arr.push(opt);
      setSelected(arr);
      onChange?.(arr);
      return;
    }

    // single select
    setSelected(opt);
    onChange?.(opt);
    setOpen(false);
  }

  function handleToggle(e?: GestureResponderEvent) {
    if (disabled) return;
    setOpen((v) => !v);
  }

  function clearSelection() {
    setSelected(null);
    onChange?.(null);
  }

  const displayLabel = useMemo(() => {
    if (!selected) return placeholder;
    if (multi && Array.isArray(selected)) {
      if (selected.length === 0) return placeholder;
      return selected.map((s) => labelExtractor(s)).join(', ');
    }
    return labelExtractor(selected as Option<T>);
  }, [selected, placeholder, labelExtractor, multi]);

  const RenderListItem = ({ item }: { item: Option<T> }) => {
    const sel = isSelected(item);
    if (renderItem) return (
      <TouchableOpacity onPress={() => handleSelect(item)} style={[styles.item, itemStyle]}>
        {renderItem(item, sel)}
      </TouchableOpacity>
    );

    return (
      <TouchableOpacity onPress={() => handleSelect(item)} style={[styles.item, itemStyle]}>
        <Text style={styles.itemLabel}>{labelExtractor(item)}</Text>
        {showSelectionIndicator && sel ? <Text style={styles.checkmark}>✓</Text> : null}
      </TouchableOpacity>
    );
  };

  const list = (
    <View style={[styles.dropdownInner, dropdownStyle, { maxHeight: maxDropdownHeight }]}>
      {searchable ? (
        <TextInput
          placeholder="Search..."
          value={query}
          onChangeText={setQuery}
          style={styles.search}
          testID={testID ? `${testID}-search` : undefined}
        />
      ) : null}

      <FlatList
        data={flatOptions}
        keyExtractor={(o) => String(keyExtractor(o))}
        renderItem={({ item }) => <RenderListItem item={item} />}
        keyboardShouldPersistTaps="handled"
        style={{ flex: 1 }}
      />
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={handleToggle}
        activeOpacity={0.7}
        style={[styles.trigger, disabled ? styles.disabled : null]}
        testID={testID}
      >
        <Text style={[selected ? styles.label : styles.placeholder, selected ? labelStyle : placeholderStyle]} numberOfLines={1}>
          {displayLabel}
        </Text>
        <Text style={styles.caret}>{open ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {useModal ? (
        <Modal visible={open} animationType="fade" transparent onRequestClose={() => setOpen(false)}>
          <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setOpen(false)} />
          <View style={styles.modalContainer}>{list}</View>
        </Modal>
      ) : (
        open ? <View style={[styles.dropdownInline, dropdownStyle]}>{list}</View> : null
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  trigger: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    color: '#111',
    flex: 1,
    marginRight: 8,
  },
  placeholder: {
    fontSize: 16,
    color: '#888',
    flex: 1,
    marginRight: 8,
  },
  caret: {
    fontSize: 12,
    color: '#444',
    marginLeft: 6,
  },
  dropdownInner: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemLabel: {
    fontSize: 15,
  },
  checkmark: {
    fontSize: 14,
    color: '#0a84ff',
    marginLeft: 8,
  },
  search: {
    borderWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 10,
    paddingVertical: Platform.select({ ios: 8, android: 6 }),
    borderRadius: 6,
    marginBottom: 8,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  modalContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: 100,
    borderRadius: 12,
  },
  dropdownInline: {
    marginTop: 8,
  },
  disabled: {
    opacity: 0.6,
  },
});

// --------------------------- Usage Example ---------------------------
// You can copy the component into "Dropdown.tsx" and use it like this:
//
// import Dropdown, { Option } from './Dropdown';
//
// const opts: Option[] = [
//   { id: '1', label: 'Apple', value: 'apple' },
//   { id: '2', label: 'Banana', value: 'banana' },
//   { id: '3', label: 'Cherry', value: 'cherry' },
// ];
//
// <Dropdown
//   options={opts}
//   value={null}
//   onChange={(sel) => console.log('selected', sel)}
//   placeholder="Pick a fruit"
//   searchable
//   multi
// />
