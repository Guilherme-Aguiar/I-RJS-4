import { Component, useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

export interface FoodInterface {
  id: number,
  name: string,
  description: string,
  price: string,
  available: boolean,
  image: string
}

export function Dashboard() {

  const [ foods, setFoods] = useState<FoodInterface[]>([]);
  const [ editingFood, setEditingFood] = useState<FoodInterface>(
    { 
      id: 0,
      name: '',
      description: '',
      price: '',
      available: false,
      image: ''
    }
  );
  const [ modalOpen, setModalOpen] = useState(false);
  const [ editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function getFood() {
      const response = await api.get('/foods');
      
      setFoods(response.data);
    }

    getFood();
  }, [])

  const handleAddFood = async (food: FoodInterface) => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([
        ...foods,
        response.data
      ])
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: FoodInterface) => {

    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number) => {

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  }

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  }

  const handleEditFood = (food: FoodInterface) => {
    setEditingFood(food);
    setEditModalOpen(true);
  }


  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              foodItem={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
