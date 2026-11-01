import { useState } from 'react'
import type { SubmitEvent, CSSProperties } from 'react'
import { Plus, ArrowUpRight } from 'lucide-react'
import { categoryColors, priorityLabels } from '../types/task'
import type { TaskDraft, Priority } from '../types/task'
export function TaskForm({ onAdd }: { onAdd: (task: TaskDraft) => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [color, setColor] = useState(categoryColors[0])
  const [error, setError] = useState('')
  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim()) { setError('Введи назву завдання — не лише пробіли.'); return }
    onAdd({ title: title.trim(), description: description.trim(), category: category.trim() || 'Без категорії', priority, categoryColor: color })
    setTitle(''); setDescription(''); setCategory(''); setPriority('medium'); setColor(categoryColors[0]); setError('')
  }
  return <section className="task-form"><div className="task-form__heading"><span className="task-form__icon"><Plus size={21} /></span><h2>Нове завдання</h2><ArrowUpRight size={19} /></div><p className="task-form__intro">З чого почнемо сьогодні?</p><form onSubmit={submit} noValidate><label className="field" htmlFor="task-title">Назва <span>*</span><input id="task-title" value={title} onChange={event => { setTitle(event.target.value); setError('') }} placeholder="Що плануєш вивчити?" required maxLength={140} aria-invalid={!!error} aria-describedby={error ? 'title-error' : undefined} /></label>{error && <p className="task-form__error" id="title-error" role="alert">{error}</p>}<label className="field" htmlFor="task-description">Опис <span className="field__optional">необов’язково</span><textarea id="task-description" value={description} onChange={event => setDescription(event.target.value)} placeholder="Кілька деталей або маленьких кроків…" rows={3} maxLength={1000} /></label><label className="field" htmlFor="task-category">Категорія<input id="task-category" list="categories" value={category} onChange={event => setCategory(event.target.value)} placeholder="Наприклад, React" maxLength={40} /></label><datalist id="categories"><option value="React" /><option value="TypeScript" /><option value="Дизайн" /><option value="Практика" /></datalist><fieldset className="task-form__colors"><legend>Колір категорії</legend>{categoryColors.map((value, index) => <button key={value} type="button" className={`task-form__color${color === value ? ' task-form__color--selected' : ''}`} style={{ '--swatch': value } as CSSProperties} aria-label={['Синій', 'Фіолетовий', 'Зелений', 'Помаранчевий', 'Рожевий'][index]} aria-pressed={color === value} onClick={() => setColor(value)} />)}</fieldset><label className="field" htmlFor="task-priority">Пріоритет<select id="task-priority" value={priority} onChange={event => setPriority(event.target.value as Priority)}>{Object.entries(priorityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><button className="button button--primary task-form__submit" type="submit"><Plus size={18} /> Додати завдання</button><p className="task-form__hint">Маленький план — початок великих змін.</p></form></section>
}
