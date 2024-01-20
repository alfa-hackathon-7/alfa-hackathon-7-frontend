import styles from './my-plan.module.scss';
import Header from '../../components/Header/header';
import BackButton from '../../entities/backbutton/backbutton';
import { Plan } from '../../entities/plan-component/plan';

export const MyPlan = () => {
	return (
		<>
			<Header />
			<section className={styles.myPlan}>
				<div className={styles.container}>
					<BackButton />
				</div>
				<div className={styles.wrapper}>
					<h1 className={styles.title}>Мой план развития</h1>
					<div className={styles.container}>
						<Plan />
					</div>
				</div>
			</section>
		</>
	);
};
