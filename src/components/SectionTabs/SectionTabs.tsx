import styles from './SectionTabs.module.css'

type Section = "tasks" | "lists"

interface SectionTabsProps {
  activeSection: Section,
  onChange: (section: Section) => void
}

export default function SectionTabs({ activeSection, onChange } : SectionTabsProps) {
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
