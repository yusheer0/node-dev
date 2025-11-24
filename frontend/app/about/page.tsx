import commonStyles from '@/app/styles/common.module.scss';
import aboutStyles from './about.module.scss';

export const metadata = {
  title: 'О проекте | node.dev',
  description: 'Информация о проекте node.dev - блоге о разработке на Node.js',
};

export default function AboutPage() {
  return (
    <div className={commonStyles.page}>
      <div className={commonStyles.blockContainer}>
        <div className={commonStyles.pageWrapper}>
          <div className={aboutStyles.aboutContent}>
            <h1 className={aboutStyles.mainTitle}>
              <strong>node.dev</strong> - это база знаний backend разработчика на NodeJs.
              Не очередной сервис для прохождения собеседований, а полноценный профиль который тебе стоит закрыть
            </h1>

            <h2>Что вы найдете в блоге:</h2>
            <ul>
              <li>Практические руководства по Node.js</li>
              <li>Обзоры фреймворков и библиотек</li>
              <li>Советы по оптимизации производительности</li>
              <li>Материалы по архитектуре приложений</li>
              <li>Новости из мира Node.js</li>
            </ul>

            <h2>Связаться:</h2>
            <p>
              Если у вас есть вопросы, предложения или вы хотите обсудить Node.js разработку,
              вы можете связаться со мной через:
            </p>
            <ul>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer">Telegram сообщество node.dev</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">Telegram автора</a></li>
              <li><a href="mailto:contact@example.com">Реклама</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

