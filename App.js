import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function App() {
  const [time, setTime] = useState(60);
  const [hasStarted, setHasStarted] = useState(false);

  const teaData = {
    Green: { color: '#A8D5BA', brewTime: 20 },
    Black: { color: '#D2691E', brewTime: 40 },
    Oolong: { color: '#C08457', brewTime: 30 },
    White: { color: '#F5F5DC', brewTime: 12 },
    Herbal: { color: '#FFB6C1', brewTime: 15 },
  };
  const [teaType, setTeaType] = useState("Green");
  const [teaColor, setTeaColor] = useState(teaData['Green'].color);
  const [brewTime, setBrewTime] = useState(teaData['Green'].brewTime);

  const handleTeaChange = (tea) => {
    setTeaType(tea);
    setTeaColor(teaData[tea].color);
    setBrewTime(teaData[tea].brewTime);
  };

  useEffect(() => {
    let timer;    
    if (hasStarted && time > 0) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setHasStarted(false);
      alert("Time's up! Next cup of tea! :)");
    }
    return () => clearInterval(timer);
  }, [hasStarted, time]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setTime(brewTime);
    setHasStarted(true);
  };

  return (
    <View style={styles.container}>
      {!hasStarted ? (
        <>
          <Text style={styles.label}>Let's start to brew a cup of tea:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={teaType}
              onValueChange={handleTeaChange}
              style={styles.picker}
            >
              {Object.keys(teaData).map((tea) => (
                <Picker.Item key={tea} label={tea} value={tea} />
              ))}
            </Picker>
            <View style={[styles.colorBox, { backgroundColor: teaColor }]} />
          </View>
        </>
      ) : (
        <>
        <Text style={styles.hint}>
          Take the time, slow down, and prepare for a cup of tea.
          </Text>
        <Text style={styles.timer}>{formatTime(time)}</Text>
        </>
      )}

      <Button title={
          hasStarted ? "Back" : "Start"
        } 
        onPress={
          hasStarted 
          ? () => {setHasStarted(false);}
          : startTimer
        } />
      <Button title="Start a new cup of tea!" onPress={() => {
        setHasStarted(false);
        setTime(brewTime); 
        }
        } />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
  },
  label: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
  },
  hint: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  picker: {
    height: 200,
    width: 150,
    color: '#000',
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
});

