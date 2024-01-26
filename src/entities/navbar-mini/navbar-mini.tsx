import styles from './navbar-mini.module.scss';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { TwoUsersMIcon } from '@alfalab/icons-glyph/TwoUsersMIcon';
import { RocketMIcon } from '@alfalab/icons-glyph/RocketMIcon';
import { ArrowLeftMediumMIcon } from '@alfalab/icons-glyph/ArrowLeftMediumMIcon';
import { UserStarMIcon } from '@alfalab/icons-glyph/UserStarMIcon';
import { roleUrl } from '../../shared/utils/urls';
interface ExecutiveProps {
	isExecutive?: boolean;
	isEmployee?: boolean;
	isMentor?: boolean;
}
export const NavBarMini: React.FC<ExecutiveProps> = ({
	isExecutive,
	isEmployee,
	isMentor,
}) => {
	const navigate = useNavigate();
	const location = useLocation();

	const onGoBack = () => {
		// Сотрудник
		if (location.pathname === '/service-iprs/myteam' && isExecutive) {
			navigate('/main', { replace: true });
		}
		if (
			location.pathname === '/service-iprs/my' &&
			(isEmployee || !isExecutive)
		) {
			navigate('/main', { replace: true });
		}
		if (
			(location.pathname === '/service-iprs/ipr/2' || '/service-iprs/ipr/1') &&
			isExecutive
		) {
			navigate('/service-iprs/myteam', { replace: true });
		}
		if (location.pathname === '/service-iprs/ipr/3' && !isExecutive) {
			navigate('/service-iprs/my', { replace: true });
		}
		// if (
		// 	location.pathname === '/service-iprs/myteam' &&
		// 	user.role === 'myteam'
		// ) {
		// 	navigate('/', { replace: true });
		// }
		// if (
		// 	location.pathname === ' /service-iprs/myteam/history' &&
		// 	user.role === 'myteam'
		// ) {
		// 	navigate('/service-iprs/myteam', { replace: true });
		// }

		// if (location.pathname === '/service-iprs/my' && user.role === 'my') {
		// 	navigate('/', { replace: true });
		// }
		// if (location.pathname === '/service-iprs/ipr/:id' && user.role === 'my') {
		// 	navigate('/service-iprs/my', { replace: true });
		// }
	};
	return (
		<aside className={styles.aside}>
			<nav className={styles.navtab}>
				<ul className={styles.list}>
					<li className={styles.item}>
						<div className={styles.link} onClick={onGoBack}>
							<ArrowLeftMediumMIcon
								className={styles.iconBack}
								fill="currentColor"
							></ArrowLeftMediumMIcon>
							<span>Назад</span>
						</div>
					</li>
					{isExecutive ? (
						<li className={styles.item}>
							<NavLink className={styles.link} to={roleUrl[0].url}>
								<TwoUsersMIcon
									fill="currentColor"
									className={styles.icon}
								></TwoUsersMIcon>
								<span>Развитие команды</span>
							</NavLink>
						</li>
					) : (
						''
					)}
					{!isMentor && (
						<li className={styles.item}>
							<NavLink className={styles.link} to={roleUrl[1].url}>
								<RocketMIcon
									fill="currentColor"
									className={styles.icon}
								></RocketMIcon>
								Мой план развития
							</NavLink>
						</li>
					)}
					{(isExecutive && isMentor) || isExecutive ? (
						<li className={styles.item}>
							<NavLink className={styles.link} to={roleUrl[2].url}>
								<UserStarMIcon
									fill="currentColor"
									className={styles.icon}
								></UserStarMIcon>
								Менторство
							</NavLink>
						</li>
					) : (
						''
					)}
				</ul>
			</nav>
		</aside>
	);
};

export default NavBarMini;
