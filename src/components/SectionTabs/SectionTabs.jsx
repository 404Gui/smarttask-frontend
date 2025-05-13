import styles from './SectionTabs.module.css'

export default function SectionTabs({ activeSection, onChange }) {
  return (
    <div className={styles.tabs}>
      <button
        className={activeSection === 'tasks' ? styles.active : ''}
        onClick={() => onChange('tasks')}
      >
        Tarefas
      </button>
      <button
        className={activeSection === 'lists' ? styles.active : ''}
        onClick={() => onChange('lists')}
      >
        Listas
      </button>      
    </div>
  )
}
