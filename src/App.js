import {
	Button,
	Container,
	Text,
	Title,
	Modal,
	TextInput,
	Group,
	Card,
	ActionIcon,
	Code,
} from '@mantine/core';
import { useState, useRef, useEffect } from 'react';
import { MoonStars, Sun, Trash } from 'tabler-icons-react';
import React, { Component }  from 'react';
import {
	MantineProvider,
	ColorSchemeProvider,
	ColorScheme,
} from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';


export default function App() {
	
	/**
	 * API Info
	 */
	
	var gapi = window.gapi;
	var CLIENT_ID = "595165491330-i1blk9j26agpbbs1e7c8cbplbbqmlomc.apps.googleusercontent.com";
	var API_KEY = "AIzaSyArW-06J-PrhKzHLQN2lGqm9MjPWHsRF2U";
	var DISCOVERY_DOC = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
	var SCOPES = "https://www.googleapis.com/auth/calendar";
	var CLIENT_SECRET = "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"
	
	
    //second version
	/** 
	const { google } = require('googleapis');
	const { OAuth2 } = google.auth

	const oAuth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET);

	oAuth2Client.setCredentials({refresh_token: '4/0AVHEtk6rM4Mm8yAe63zNVyyt2JRz1cJN9QM2pYtuGDIYlWFr3f-k_wOwbzvew7k7uIuWQA'});
	const calendar = google.calendar({ version : 'v3', auth: oAuth2Client });
	*/


	

	const [tasks, setTasks] = useState([]);
	const [opened, setOpened] = useState(false);

	const preferredColorScheme = useColorScheme();
	const [colorScheme, setColorScheme] = useLocalStorage({
		key: 'mantine-color-scheme',
		defaultValue: 'light',
		getInitialValueInEffect: true,
	});
	const toggleColorScheme = value =>
		setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

	useHotkeys([['mod+J', () => toggleColorScheme()]]);

	const taskTitle = useRef('');
	const taskSummary = useRef('');

	
	function getDate() {

	}

	//functionality to create a calendar event given a task 
	function createEvent(task, time) {
		
		var dateObj = new Date();
		var month = dateObj.getUTCMonth() + 1; //months from 1-12
		var day = dateObj.getUTCDate();
		var year = dateObj.getUTCFullYear();

		const newdate = year + "-" + month + "-" + day;

		var event = {
			"summary": task.title,
			"description": task.summary,
			"start": {
				"dateTime": newdate + "T07:00:00-08:00",
	
			},
			"end": {
				"dateTime": newdate + "T07:00:00-08:00",
	
			}
		}
		return event;
	}

	function addEvents() {
		
		gapi.load('auth2', () => {
			console.log('loaded client')
	  
			gapi.client.init({
			  apiKey: API_KEY,
			  clientId: CLIENT_ID,
			  discoveryDocs: DISCOVERY_DOC,
			  scope: SCOPES,
			  pluginName: 'todo-list'
			})
	  
			gapi.client.load('calendar', 'v3', () => console.log('bam!'))
	  
			const googleAuth = gapi.auth2.getAuthInstance(); //problems here
			
			const googleUser = googleAuth.signIn()     //problems here
			.then(() => {
				
				for (const task of [...tasks]) {
					var request = gapi.client.calendar.events.insert({
						'calendarId': 'primary',
						'resource': createEvent(task),
					})
			
					request.execute(event => {
						console.log(event)
						window.open(event.htmlLink)
					})
				}
			  
	  
		
			})
			
		  })
		
	}

	function createTask() {
		setTasks([
			...tasks,
			{
				title: taskTitle.current.value,
				summary: taskSummary.current.value,
			},
		]);

		saveTasks([
			...tasks,
			{
				title: taskTitle.current.value,
				summary: taskSummary.current.value,
			},
		]);
	}

	function deleteTask(index) {
		var clonedTasks = [...tasks];

		clonedTasks.splice(index, 1);

		setTasks(clonedTasks);

		saveTasks([...clonedTasks]);
	}



	function deleteAll() {
		var clonedTasks = [...tasks];

		clonedTasks = [];

		setTasks(clonedTasks);

		saveTasks([...clonedTasks]);
	}

	function loadTasks() {
		let loadedTasks = localStorage.getItem('tasks');

		let tasks = JSON.parse(loadedTasks);

		if (tasks) {
			setTasks(tasks);
		}
	}

	function saveTasks(tasks) {
		localStorage.setItem('tasks', JSON.stringify(tasks));
	}

	useEffect(() => {
		loadTasks();
	}, []);

	return (
		<ColorSchemeProvider
			colorScheme={colorScheme}
			toggleColorScheme={toggleColorScheme}>
			<MantineProvider
				theme={{ colorScheme, defaultRadius: 'md' }}
				withGlobalStyles
				withNormalizeCSS>
				<div className='App'>
					<Modal
						opened={opened}
						size={'md'}
						title={'New Task'}
						withCloseButton={false}
						onClose={() => {
							setOpened(false);
						}}
						centered>
						<TextInput
							mt={'md'}
							ref={taskTitle}
							placeholder={'Task Title'}
							required
							label={'Title'}
						/>
						<TextInput
							ref={taskSummary}
							mt={'md'}
							placeholder={'Task Summary'}
							label={'Summary'}
						/>
						<Group mt={'md'} position={'apart'}>
							<Button
								onClick={() => {
									setOpened(false);
								}}
								variant={'subtle'}>
								Cancel
							</Button>
							<Button
								onClick={() => {
									createTask();
									setOpened(false);
									
								}}>
								Create Task
							</Button>
				
						</Group>
						
					</Modal>
					
					

					<Container size={550} my={40}>
						<Group position={'apart'}>
							<Title
								sx={theme => ({
									fontFamily: `Greycliff CF, ${theme.fontFamily}`,
									fontWeight: 900,
								})}>
								My Tasks
							</Title>
							<ActionIcon
								color={'blue'}
								onClick={() => toggleColorScheme()}
								size='lg'>
								{colorScheme === 'dark' ? (
									<Sun size={16} />
								) : (
									<MoonStars size={16} />
								)}
							</ActionIcon>
						</Group>
						{tasks.length > 0 ? (
							tasks.map((task, index) => {
								if (task.title) {
									return (
										<Card withBorder key={index} mt={'sm'}>
											<Group position={'apart'}>
												<Text weight={'bold'}>{task.title}</Text>
												<ActionIcon
													onClick={() => {
														deleteTask(index);
													}}
													color={'red'}
													variant={'transparent'}>
													<Trash />
												</ActionIcon>
											</Group>
											<Text color={'dimmed'} size={'md'} mt={'sm'}>
												{task.summary
													? task.summary
													: 'No summary was provided for this task'}
											</Text>
										</Card>
									);
								}
							})
						) : (
							<Text size={'lg'} mt={'md'} color={'dimmed'}>
								You have no tasks
							</Text>
						)}
						<Button
							onClick={() => {
								setOpened(true);
							}}
							fullWidth
							mt={'md'}>
							New Task
						</Button>
						<Button
							onClick={() => {
								//gapiLoaded();
								//gisLoaded();
								//handleAuthClick();
								addEvents();
								deleteAll();
								 
							}}
							fullWidth
							mt={'md'}>
							Export to Calendar
						</Button>
					</Container>
				</div>
			</MantineProvider>
		</ColorSchemeProvider>
	);
}
