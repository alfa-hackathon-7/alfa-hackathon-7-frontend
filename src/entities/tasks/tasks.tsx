import React, { ChangeEvent, useState } from 'react';
import { useAppSelector } from '../../shared/hooks/redux';

import styles from './tasks.module.scss';

import { Table } from '@alfalab/core-components/table';
import { ChevronDownMIcon } from '@alfalab/icons-glyph/ChevronDownMIcon';
import { Status } from '@alfalab/core-components/status';
import { Textarea } from '@alfalab/core-components/textarea';
import { UniversalDateInput } from '@alfalab/core-components/universal-date-input';
import { CalendarDesktop } from '@alfalab/core-components/calendar/desktop';
import { Collapse } from '@alfalab/core-components/collapse';
import { InputAutocomplete } from '@alfalab/core-components/input-autocomplete';
import { Arrow } from '@alfalab/core-components/select/components/arrow';
import linkToCourses from '../../images/link-gotocourses.png';
import { Attach } from '@alfalab/core-components/attach';
import { FileUploadItem } from '@alfalab/core-components/file-upload-item';
import { Button } from '@alfalab/core-components/button';
import { CrossCircleMIcon } from '@alfalab/icons-glyph/CrossCircleMIcon';
import { CheckmarkCircleMIcon } from '@alfalab/icons-glyph/CheckmarkCircleMIcon';

import { courses } from '../../shared/utils/constants';
import { tasksData } from '../../shared/utils/constants';

interface TasksProps {
	isEmployee: boolean;
}

interface OptionShape {
	key: string;
}

interface Education {
	name: string;
	url: string;
	status: string;
}

interface FormData {
	id: number;
	name: string;
	dateOfEnd: string;
	description: string;
	educations: Education[];
	commentOfMentor: string;
	commentOfEmployee: string;
}

export const Tasks: React.FC<TasksProps> = ({ isEmployee }) => {
	const [taskData, setTaskData] = React.useState<FormData>({
		id: 0,
		name: '',
		dateOfEnd: '',
		description: '',
		educations: [],
		commentOfMentor: '',
		commentOfEmployee: '',
	});
  
	const [shownChevron, setShownChevron] = React.useState(true);
	const [multiple, setMultiple] = React.useState(true);
	const [progress, setProgress] = useState<number | undefined>(0);
	const [valueCourse, setValueCourse] = useState<string>('');

	console.log('formData из задачах: ', taskData);

	const handleInputChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	): void => {
		const { name, value } = event.target;
		setTaskData((prevData) => ({ ...prevData, [name]: value }));
	};

	const optionsCourses: OptionShape[] = courses;

	const handleInputCourse = (
		event: ChangeEvent<HTMLInputElement> | null,
		{ value }: { value: string }
	) => {
		setValueCourse(value);
	};

	const handleCourseSelection = (
		selectedCourses: OptionShape[] | string
	): void => {
		let selectedEducations: Education[] = [];

		if (typeof selectedCourses === 'string') {
			const courseNames = selectedCourses.split(',').map((name) => name.trim());

			selectedEducations = courseNames.map((name) => ({
				name,
				url: '',
				status: '',
			}));
		} else {
			selectedEducations = selectedCourses.map((course) => ({
				name: course.key,
				url: '',
				status: '',
			}));
		}

		setTaskData((prevData) => ({
			...prevData,
			educations: selectedEducations,
		}));
	};

	const inputValues: string[] = valueCourse.replace(/ /g, '').split(',');
	const selectedOptions: OptionShape[] = optionsCourses.filter((option) =>
		inputValues.includes(option.key.trim())
	);

	const selected: string[] | OptionShape = multiple
		? selectedOptions.map((option) => option.key)
		: optionsCourses.find((o) => o.key === inputValues[0]) || [];

	const tagValues = valueCourse.trim().split(',');

	const handleChangeCourse = ({
		selected,
		selectedMultiple,
	}: {
		selected: OptionShape | null;
		selectedMultiple: OptionShape[] | null;
	}): void => {
		if (multiple) {
			const value = selectedMultiple?.length
				? selectedMultiple.map((option) => option.key).join(', ') // если добавить + ',' выводит лишний таг, убирается с клавиатуры
				: '';
			setValueCourse(value);
			handleCourseSelection(value);
			return;
		}
		setValueCourse(selected ? selected.key : '');
	};

	const matchOption = (optionsCourses: any, inputValue: any) =>
		optionsCourses.key.toLowerCase().includes((inputValue || '').toLowerCase());

	const getFilteredOptions = (): OptionShape[] => {
		if (multiple) {
			return optionsCourses.filter((option) => {
				return (
					selectedOptions.includes(option) ||
					matchOption(option, inputValues[inputValues.length - 1])
				);
			});
		}

		return optionsCourses.some(({ key }) => key === valueCourse)
			? optionsCourses
			: optionsCourses.filter((option) => matchOption(option, valueCourse));
	};

	const [expandedTasks, setExpandedTasks] = useState<Record<number, boolean>>(
		{}
	);
	const [valueEndDate, setEndDate] = useState<string>('');

	const handleChangeEndDate = (event: any, { value }: { value: string }) => {
		setEndDate(value);
		setTaskData((prevData) => ({ ...prevData, endDate: value }));
	};

	const chevronClick = (taskId: number) => {
		setExpandedTasks((prevExpandedTasks) => ({
			...prevExpandedTasks,
			[taskId]: !prevExpandedTasks[taskId],
		}));
	};

	const simulateProgress = () => {
		const interval = setInterval(() => {
			setProgress((prevProgress) => {
				if (prevProgress === 100) {
					clearInterval(interval);
					return 100;
				}
				return prevProgress !== undefined ? prevProgress + 1 : 0;
			});
		}, 100);
	};

	const handleChange = () => {
		simulateProgress();
	};

	const onDeleteTag = (event: React.MouseEvent<HTMLDivElement>) => {
		const clickedTagValue = event.currentTarget.textContent;
		const updatedTagValues = tagValues.filter(
			(value) => value !== clickedTagValue
		);

		setValueCourse(updatedTagValues.join(', '));
	};

	const getTaskData = (): FormData => {
		return taskData;
	};

	return (
		<Table className={styles.table}>
			<Table.TBody>
				{tasksData.map(
					({ id, title, deadline, statusColor, statusText, closeButton }) => (
						<React.Fragment key={id}>
							<Table.TRow className={styles.row}>
								<Table.TCell className={styles.cellWithIcon}>
									{closeButton && <CrossCircleMIcon color="#70707A" />}
									{title}
								</Table.TCell>
								<Table.TCell>{deadline}</Table.TCell>
								<Table.TCell>
									<Status view="soft" color={statusColor}>
										{statusText}
									</Status>
								</Table.TCell>
								<Table.TCell>
									<ChevronDownMIcon onClick={() => chevronClick(id)} />
								</Table.TCell>
							</Table.TRow>
							{expandedTasks[id] && (
								<Table.TRow className={styles.row}>
									<Table.TCell colSpan={4}>
										<Collapse expanded={expandedTasks[id]}>
											<div className={styles.openedTask}>
												<div className={styles.wrapper}>
													<Textarea
														fieldClassName={styles.goalName}
														maxHeight={56}
														label="Название*"
														name="name"
														onChange={handleInputChange}
														labelView="inner"
														size="m"
														block={true}
														showCounter={true}
														autosize={true}
													/>
													<UniversalDateInput
														block={true}
														view="date"
														label="Дата завершения"
														size="m"
														value={valueEndDate}
														onChange={handleChangeEndDate}
														picker={true}
														Calendar={CalendarDesktop}
														calendarProps={{
															selectorView: 'month-only',
														}}
														clear={true}
														onClear={(e) => {
															e.stopPropagation();
															setEndDate('');
														}}
													/>
												</div>
												<Textarea
													fieldClassName={styles.textClass}
													maxHeight={91}
													label="Описание"
													name="description"
													value={taskData.description}
													onChange={handleInputChange}
													labelView="inner"
													size="m"
													block={true}
													maxLength={96}
													showCounter={true}
													autosize={true}
												/>
												<div className={styles.coursesWrapper}>
													<InputAutocomplete
														name="course"
														value={valueCourse}
														block={true}
														multiple={multiple}
														allowUnselect={true}
														closeOnSelect={true}
														onChange={handleChangeCourse}
														onInput={handleInputCourse}
														options={getFilteredOptions()}
														Arrow={shownChevron ? Arrow : undefined}
														showEmptyOptionsList={true}
														className={styles.inputCourses}
														size="s"
														label="Тренинги и курсы"
														placeholder="Начните вводить название"
													/>

													<img
														src={linkToCourses}
														alt="ссылка на курсы"
														className={styles.linkToCourses}
													></img>
												</div>
												<div className={styles.formRowTag}>
													{valueCourse.length > 0
														? tagValues.map((value: string, key: number) => {
																return (
																	<div key={value.length + 1}>
																		<div
																			className={styles.formTag}
																			onClick={onDeleteTag}
																		>
																			<div className={styles.formCircle}>
																				<CrossCircleMIcon />
																			</div>
																			{value}
																		</div>
																	</div>
																);
															})
														: ''}
												</div>
												{isEmployee && (
													<Textarea
														fieldClassName={styles.textClass}
														maxHeight={91}
														label="Комментарий руководителя"
														name="commentOfMentor"
														onChange={handleInputChange}
														labelView="inner"
														size="m"
														block={true}
														maxLength={96}
														showCounter={true}
														autosize={true}
													/>
												)}
												<Textarea
													fieldClassName={styles.textClass}
													maxHeight={91}
													label="Ваш комментарий"
													name="commentOfEmployee"
													onChange={handleInputChange}
													labelView="inner"
													size="m"
													block={true}
													maxLength={96}
													showCounter={true}
													autosize={true}
												/>
												{isEmployee && (
													<div>
														<div className={styles.attachWrapper}>
															<p className={styles.attachTitle}>
																Приклепленные файлы
															</p>
															<Attach
																buttonContent="Добавить"
																buttonProps={{
																	style: {
																		backgroundColor: 'transparent',
																		color: '#2A77EF',
																		padding: '0',
																		margin: '0',
																	},
																}}
																size="m"
																onChange={handleChange}
																multiple={multiple}
																fileClassName={styles.attachButton}
																noFileText=""
															/>
														</div>
														<FileUploadItem
															name="Название файла.pdf"
															uploadDate="22.01.2018"
															size={45000}
															showDelete={true}
														/>
														<FileUploadItem
															name="Название файла.pdf"
															uploadDate="22.01.2018"
															uploadPercent={23.5678}
															uploadStatus="UPLOADING"
															showDelete={true}
														/>
														<FileUploadItem
															name="Название файла.jpg"
															uploadDate="22.01.2018"
															size={45000}
															uploadStatus="ERROR"
															showDelete={true}
														/>
														<Button
															view="primary"
															size="s"
															className={styles.button}
														>
															Отправить на проверку
														</Button>
													</div>
												)}
											</div>
										</Collapse>
									</Table.TCell>
								</Table.TRow>
							)}
						</React.Fragment>
					)
				)}
			</Table.TBody>
		</Table>
	);
};
