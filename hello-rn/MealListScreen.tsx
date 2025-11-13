import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { ActivityIndicator, Text, Card, Title, Searchbar, Button } from 'react-native-paper';
import { type NavigationProp, type RouteProp } from '@react-navigation/native'; 
import { RootStackParamList } from './App'; 

type MealListItem = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

type MealListProps = {
    navigation: NavigationProp<RootStackParamList, 'MealList'>;
    route: RouteProp<RootStackParamList, 'MealList'>;
};

const API_URL = "https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood";

export function MealListScreen({ navigation }: MealListProps) {
  const [meals, setMeals] = useState<MealListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function fetchMeals() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("HTTP Error " + response.status);
      }
      const data = await response.json();
      setMeals(data && data.meals ? data.meals : []);
    } catch (e: any) {
      setError("Falha ao carregar o catálogo: " + e.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMeals();
  }, []);

  const filteredMeals = meals.filter((meal) =>
    meal.strMeal.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: MealListItem }) => (
    <Card 
      style={styles.card} 
      onPress={() => navigation.navigate('MealDetail', { mealId: item.idMeal })} 
      mode="elevated"
    >
      <Card.Cover source={{ uri: item.strMealThumb }} style={styles.cardImage} />
      <Card.Content style={styles.cardContent}>
        <Title style={styles.title} numberOfLines={2}>{item.strMeal}</Title>
        <Text style={styles.subtitle}>Clique para ver a receita completa.</Text>
      </Card.Content>
      <Card.Actions>
         <Button mode="contained" onPress={() => navigation.navigate('MealDetail', { mealId: item.idMeal })}>
            Ver Detalhes
         </Button>
      </Card.Actions>
    </Card>
  );

  if (isLoading && meals.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00BCD4" />
        <Text style={styles.centerText}>Carregando receitas...</Text>
      </View>
    );
  }

  if (error && meals.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Button mode="contained" onPress={fetchMeals} style={{marginTop: 15}}>
            Tentar Novamente
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar receita..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      <FlatList
        data={filteredMeals}
        keyExtractor={(item) => item.idMeal}
        renderItem={renderItem}
        onRefresh={fetchMeals}
        refreshing={isLoading}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.centerText}>Nenhum resultado encontrado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 8, backgroundColor: '#F0F0F0' }, 
    center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#FFFFFF' },
    centerText: { color: '#333333', fontSize: 16, marginTop: 10, textAlign: 'center' },
    errorText: { color: 'red', fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
    searchBar: { marginBottom: 10, backgroundColor: '#FFFFFF', elevation: 2 },
    listContent: { paddingBottom: 20 },
    card: { 
      marginVertical: 8, 
      backgroundColor: '#FFFFFF', 
    },
    cardImage: { height: 180 },
    cardContent: { paddingVertical: 10 },
    title: { color: '#333333', fontSize: 18, fontWeight: 'bold' },
    subtitle: { color: '#666666', fontSize: 12, marginTop: 4 },
});