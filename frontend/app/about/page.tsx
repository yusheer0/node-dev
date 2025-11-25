import commonStyles from '@/app/styles/common.module.scss';
import aboutStyles from './about.module.scss';

export const metadata = {
  title: 'О проекте | node.dev',
  description: 'Информация о проекте node.dev - блоге о разработке на Node.js',
};

export default function AboutPage() {
  return (
    <div className={commonStyles.page}>
      <div className={aboutStyles.aboutContent}>
        <div className={aboutStyles.aboutHeader}>
          <h1 className={aboutStyles.mainTitle}>База знаний backend разработчика</h1>
        </div>

        <div className={aboutStyles.aboutMain}>
          <h2>Что вы найдете</h2>
          <ul>
            <li>Практические и теоретические руководства по Node.js</li>
            <li>Обзоры фреймворков и библиотек</li>
            <li>Советы по оптимизации производительности</li>
            <li>Материалы по архитектуре приложений</li>
          </ul>
        </div>

        <div className={aboutStyles.aboutFooter}>
          <h2>Связаться</h2>
          <p>
            Если у вас есть вопросы, предложения или вы хотите обсудить сотрудничество или идеи, вы можете связаться со мной через:
          </p>
          <ul>
            <li><a href="https://t.me/node_deveploper" target="_blank" rel="noopener noreferrer">Сообщество Telegram</a></li>
            <li><a href="https://t.me/yusheero" target="_blank" rel="noopener noreferrer">Telegram автора</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

