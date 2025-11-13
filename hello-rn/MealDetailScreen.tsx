import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Linking } from 'react-native';
import { ActivityIndicator, Text, Title, Paragraph, Divider, Button, Card } from 'react-native-paper';
import { type RouteProp } from '@react-navigation/native'; 
import { RootStackParamList } from './App'; 

type Meal = {
    idMeal: string;
    strMeal: string;
    strInstructions: string;
    strArea: string;
    strYoutube: string;
    [key: string]: any; 
};

// Tipo de props definido internamente
type MealDetailProps = {
    route: RouteProp<RootStackParamList, 'MealDetail'>;
};

export function MealDetailScreen({ route }: MealDetailProps) {
    const { mealId } = route.params;
    const [meal, setMeal] = useState<Meal | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const API_URL_DETAIL = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;

    useEffect(() => {
        async function fetchMealDetails() {
            try {
                const response = await fetch(API_URL_DETAIL);
                const data = await response.json();
                
                if (data && data.meals && data.meals.length > 0) {
                    setMeal(data.meals[0] as Meal);
                } else {
                    setError('Receita não encontrada.');
                }
            } catch (e: any) {
                setError('Erro ao buscar detalhes da receita.');
            } finally {
                setIsLoading(false);
            }
        }
        fetchMealDetails();
    }, [mealId]); 

    const getIngredients = () => {
        if (!meal) return [];
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient && ingredient.trim()) {
                ingredients.push(`${measure} ${ingredient}`);
            }
        }
        return ingredients;
    };

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#00BCD4" />
                <Text style={styles.centerText}>Carregando detalhes...</Text>
            </View>
        );
    }

    if (error || !meal) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Erro: {error || 'Dados indisponíveis.'}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Title style={styles.title}>{meal.strMeal}</Title>
            <Paragraph style={styles.subtitle}>Culinária: {meal.strArea}</Paragraph>
            
            <Divider style={styles.divider} />

            <Card style={styles.sectionCard}>
                <Card.Content>
                    <Title style={styles.sectionTitle}>Ingredientes:</Title>
                    {getIngredients().map((item, index) => (
                        <Text key={index} style={styles.listItem}>• {item}</Text>
                    ))}
                </Card.Content>
            </Card>

            <Card style={styles.sectionCard}>
                <Card.Content>
                    <Title style={styles.sectionTitle}>Instruções:</Title>
                    <Paragraph style={styles.instructionsText}>{meal.strInstructions}</Paragraph>
                </Card.Content>
            </Card>

            {meal.strYoutube && (
                <Button 
                    mode="contained" 
                    icon="youtube"
                    style={styles.youtubeButton}
                    onPress={() => Linking.openURL(meal.strYoutube)}
                >
                    Ver Vídeo no YouTube
                </Button>
            )}
            
            <View style={{height: 20}} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#F0F0F0' }, 
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
    centerText: { color: '#333333', fontSize: 16, marginTop: 10 },
    errorText: { color: 'red', fontSize: 18, fontWeight: 'bold' },

    title: { color: '#333333', fontSize: 24, marginBottom: 4, textAlign: 'center' },
    subtitle: { color: '#666666', fontSize: 16, marginBottom: 10, textAlign: 'center' },
    divider: { marginVertical: 15, backgroundColor: '#DDDDDD' },
    
    sectionCard: {
        marginBottom: 15,
        backgroundColor: '#FFFFFF', 
        elevation: 4,
    },
    sectionTitle: {
        color: '#00BCD4', 
        fontSize: 18,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    listItem: {
        color: '#333333', 
        fontSize: 14,
        lineHeight: 22,
    },
    instructionsText: {
        color: '#333333',
        fontSize: 15,
        lineHeight: 24,
    },
    youtubeButton: {
        marginTop: 20,
        backgroundColor: '#FF0000',
    }
});