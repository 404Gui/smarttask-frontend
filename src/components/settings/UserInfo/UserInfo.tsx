import styles from "./UserInfo.module.css"


type Props = {
  username: string;
  email: string;
};

export default function UserInfo({ username, email }: Props) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Informações do Usuário</h2>
      <p className={styles.infoText}><strong>Usuário:</strong> {username}</p>
      <p className={styles.infoText}><strong>Email:</strong> {email}</p>
    </div>
  );
}