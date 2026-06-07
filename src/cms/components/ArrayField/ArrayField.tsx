import styles from './ArrayField.module.css';

export interface ItemHandlers<T> {
  update: (value: T) => void;
  remove: () => void;
  moveUp: () => void;
  moveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

interface ArrayFieldProps<T> {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, index: number, handlers: ItemHandlers<T>) => React.ReactNode;
  addItem: () => T;
  addLabel?: string;
  allowReorder?: boolean;
}

export function ArrayField<T>({
  items,
  onChange,
  renderItem,
  addItem,
  addLabel = '+ Add item',
  allowReorder = true,
}: ArrayFieldProps<T>) {
  const update = (index: number, value: T) => {
    const next = [...items];
    next[index] = value;
    onChange(next);
  };

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...items];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  };

  const moveDown = (index: number) => {
    if (index === items.length - 1) return;
    const next = [...items];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  };

  const add = () => onChange([...items, addItem()]);

  return (
    <div className={styles.root}>
      <ul className={styles.list} role="list">
        {items.map((item, index) => (
          <li key={index} className={styles.item}>
            {allowReorder && (
              <div className={styles.reorder}>
                <button
                  className={styles.reorderBtn}
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  aria-label="Move up"
                  type="button"
                >
                  ↑
                </button>
                <button
                  className={styles.reorderBtn}
                  onClick={() => moveDown(index)}
                  disabled={index === items.length - 1}
                  aria-label="Move down"
                  type="button"
                >
                  ↓
                </button>
              </div>
            )}
            <div className={styles.itemContent}>
              {renderItem(item, index, {
                update: (v) => update(index, v),
                remove: () => remove(index),
                moveUp: () => moveUp(index),
                moveDown: () => moveDown(index),
                isFirst: index === 0,
                isLast: index === items.length - 1,
              })}
            </div>
            <button
              className={styles.removeBtn}
              onClick={() => remove(index)}
              aria-label="Remove item"
              type="button"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      <button className={styles.addBtn} onClick={add} type="button">
        {addLabel}
      </button>
    </div>
  );
}

/** Convenience wrapper for simple string[] fields */
export function StringArrayField({
  items,
  onChange,
  placeholder = 'Value…',
  addLabel,
  allowReorder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addLabel?: string;
  allowReorder?: boolean;
}) {
  return (
    <ArrayField
      items={items}
      onChange={onChange}
      addItem={() => ''}
      addLabel={addLabel}
      allowReorder={allowReorder}
      renderItem={(item, _i, { update }) => (
        <input
          className="cms-input"
          value={item}
          placeholder={placeholder}
          onChange={(e) => update(e.target.value)}
        />
      )}
    />
  );
}
