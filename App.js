import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, FlatList } from 'react-native';
import { Button, TextInput, Card, Text } from 'react-native-paper'; // Import Card and Text
import * as SQLite from 'expo-sqlite';
import { useState, useEffect } from 'react';

export default function App() {

	const [product, setProduct] = useState('');
	const [amount, setAmount] = useState('');
	const [items, setItems] = useState([]);

	const db = SQLite.openDatabaseSync('shoppingListDB2');
	
	const initialize = async () => {
		try {
			await db.execAsync(`
				CREATE TABLE IF NOT EXISTS shoppingList2 (id INTEGER PRIMARY KEY NOT NULL, amount INT, product TEXT);
			`);
			await updateList();
		} catch (error) {
			console.error('Could not open database', error);
		}};

		const addItem = async () => {
			try {
				await db.runAsync('INSERT INTO shoppingList2 (product, amount) VALUES  (?, ?)',  product, amount);
				await updateList();
			} catch (e) {
				console.error('error adding item', e);
			}
		};
		
		const updateList = async () => {
			try {
				const list = await db.getAllAsync('SELECT * from shoppingList2');
				setItems(list);
			} catch (error) {
				console.error('Could not get items', error);
			}
		};

		const deleteItem = async (id) => {
			try {
				await db.runAsync('DELETE FROM shoppingList2 WHERE id=?', id);
				await updateList();
			} catch (e) {
				console.error('error deleting', e);
			}
		};
		
		useEffect(() => { initialize() }, []);

	return (
		<View style={styles.container}>
			<Text>Hello Sqlite shoppinglist!</Text>
			<TextInput 
				style={styles.textInput}
				placeholder='product' 
				onChangeText={product => setProduct(product)}
				value={product}/> 
			<TextInput 
				style={styles.textInput}
				placeholder='amount' 
				keyboardType='numeric' 
				onChangeText={amount => setAmount(amount)}
				value={amount}/> 
			<Button mode="contained" onPress={addItem}>
			add to list
			</Button>

			<FlatList
			style={{ marginTop: 10, width: '80%'}}
			data = {items}
			keyExtractor={item => item.id.toString()}
			renderItem={({ item }) =>
					<Card style={styles.card}>
						<Card.Title title={item.product}/>
						<Card.Content>
							<Text variant="bodyMedium">{item.amount}</Text>
							<Text style={{ color: '#0000ff' }} onPress={() => deleteItem(item.id)}>done</Text>
						</Card.Content>
					</Card>}
			/>
			<StatusBar style="auto" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 150,
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	textInput: {
		width: '90%',
		marginBottom: 10,
	},
	card: {
		
		marginBottom: 10,
		marginTop: 10
	},
});
