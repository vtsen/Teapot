import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function App() {
  const [time, setTime] = useState(60);
  const [choiceMade, setChoiceMade] = useState(false);
  const [timerOn, setTimerOn] = useState(false);

  const teaData = {
    Green: { color: '#A8D5BA', preheatTime: 30, brewTime: 90, coolTime: 60 },
    Black: { color: '#C08457', preheatTime: 30, brewTime: 150, coolTime: 90 },
    Herbal: { color: '#FFB6C1', preheatTime: 20, brewTime: 60, coolTime: 60 },
    Test: { color: '#E08691', preheatTime: 8, brewTime: 11, coolTime: 5 },
  };
  const [teaType, setTeaType] = useState('Green');
  const [teaColor, setTeaColor] = useState(teaData['Green'].color);
  const [preHeatTime, setPreheatTime] = useState(teaData['Green'].preheatTime);
  const [brewTime, setBrewTime] = useState(teaData['Green'].brewTime);
  const [coolTime, setCoolTime] = useState(teaData['Green'].coolTime);

  const brewStage = {
    Preheat: {
      nextStage: 'Brew',
      labelText: 'Preheating the teapot', 
      useTime: preHeatTime,
      finishHint: 'Bravo. Next, start your brew.',
      },
    Brew: { 
       nextStage: 'Cool', 
       labelText: 'Tea is brewing',
       useTime: brewTime, 
       finishHint: 'Nice Brew. Now, cool it in the cup.',
      },
    Cool: { 
      nextStage: 'Preheat',    // loop back to Preheat
      labelText: 'Cooling the tea and yourself',
      useTime: coolTime, 
      finishHint: 'Enjoy your cup of tea.',
    },
  }
  const [stage, setStage] = useState(brewStage['Preheat']);

  const handleTeaChange = (tea) => {
    setTeaType(tea);
    setTeaColor(teaData[tea].color);
    setPreheatTime(teaData[tea].preHeatTime);
    setBrewTime(teaData[tea].brewTime);
    setCoolTime(teaData[tea].coolTime);
  };

  useEffect(() => {
    let timer;    
    if (timerOn && time > 0) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setTimerOn(false);
      Alert.alert(
        "Teapot Hint",
        stage.finishHint,
        [
          { text: "OK", onPress: () => 
            {
              console.log("Finished " + stage.labelText);
              stage === 'Cool' ? setChoiceMade(false) : () => {};  // reset for next cup
              setStage(brewStage[stage.nextStage]);
              setTime(stage.useTime);
              console.log("Started " + stage.nextStage);
            } 
          }
        ]
      );
    }
    return () => clearInterval(timer);
  }, [choiceMade, timerOn, time, stage]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setTime(stage.useTime);
    setTimerOn(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: teaColor }]}>
      {!choiceMade ? (
        <>
          <Text style={styles.label}>Choose type and brew a cup of tea</Text>
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
          </View>
        </>
      ) : (
        <>
          <Text style={styles.label}>{stage.labelText}</Text>
          <Text style={styles.hint}>No hurry, just prepare a cup of tea.</Text>
          <Text style={styles.timer}>{formatTime(time)}</Text>
        </>
      )}

      <Button title={!choiceMade ? "Choose" : timerOn ? "Redo this step" : "Start this step"} 
        onPress={
          !choiceMade
          ? () => {setChoiceMade(true);}
          : timerOn
          ? () => {setTimerOn(false);}
          : startTimer
        } />
      <Button title="Start a new cup of tea!" onPress={() => {
        setChoiceMade(false);
        setTimerOn(false);
        setStage(brewStage['Preheat']);
        setTime(stage.useTime); 
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
    fontSize: 25,
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

