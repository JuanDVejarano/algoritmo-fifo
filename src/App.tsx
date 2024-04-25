import { useEffect, useState } from "react";
import "./App.scss";

function App() {
    // interfaz de la tarea
    interface taskInterface {
        id: Number;
        name: string;
        size: number;
        time: number;
        status: string;
    }

    // estados de las tareas
    const [tasks, setTasks] = useState<taskInterface[]>([]);
    const [tasksDone, setTasksDone] = useState<taskInterface[]>([]);
    const [tasksCanceled, setTasksCanceled] = useState<taskInterface[]>([]);
    let [taskID, setTaskID] = useState(0);
    let [tiempo, setTiempo] = useState(100);

    let [standby, setStandby] = useState(0); // Tiempo en espera
    let [averageTime, setAverageTime] = useState(0); // Tiempo promedio en ejecucion
    let [totalTime, setTotalTime] = useState(0); // Tiempo total en el sistema

    // funcion para crear una tarea
    const createTask = () => {
        let temporalStatus: string = "en espera";
        let nameArray: string = "tasks";

        if (tasks.length == 0) {
            temporalStatus = "en ejecucion";
        } else if (tasks.length > 9) {
            temporalStatus = "Cancelada";
            nameArray = "tasksCanceled";
        }

        const size: number = generarNumero();
        const time: number = generarNumero();
        let taskObj: taskInterface = {
            id: taskID,
            name: "Tarea " + taskID,
            size: size,
            time: time,
            status: temporalStatus,
        };
        setTaskID(++taskID);
        addTask(taskObj, nameArray);
    };

    const addTask = (task: taskInterface, nameArray: string) => {
        switch (nameArray) {
            case "tasks":
                setTasks([...tasks, task]);
                break;
            case "tasksCanceled":
                setTasksCanceled([...tasksCanceled, task]);
                break;
            case "tasksDone":
                setTasksDone([...tasksDone, task]);
                break;
            default:
                break;
        }
    };

    const generarNumero = () => {
        return Math.floor(Math.random() * 5 + 2) * 5;
    };

    useEffect(() => {
        let temporalTasks = [...tasks];
        if (temporalTasks.length > 0) {
            const timer = setTimeout(() => {
                temporalTasks[0].status = "Completada";
                addTask(temporalTasks[0], "tasksDone");
                //setTasksDone([...tasksDone, temporalTasks[0]]);
                temporalTasks.shift();

                if (temporalTasks.length > 0) {
                    temporalTasks[0].status = "en ejecucion";
                }

                setTasks(temporalTasks);
            }, tasks[0].time * tiempo);

            return () => clearTimeout(timer);
        }
    }, [tasks]);

    useEffect(() => {
        let temporalStandby = standby;
        let temporalAverageTime = averageTime;
        let temporalTotalTime = totalTime;
        //debugger;
        let valueSum = 0;
        let valueSum2 = 0;

        // Calcular tiempo promedio en ejecucion
        if (tasksDone.length > 0) {
            temporalAverageTime += tasksDone[tasksDone.length - 1].time;
        }

        // Calcular tiempo promedio en espera
        if (tasksDone.length == 0) {
            temporalStandby = 0;
        } else if (tasksDone.length > 1) {
            valueSum = temporalStandby + tasksDone[tasksDone.length - 2].time;
            temporalStandby += valueSum;
        }

        if (tasksDone.length > 0) {
            valueSum2 = tasksDone[tasksDone.length - 1].time + valueSum;
            temporalTotalTime += valueSum2;
        }

        setAverageTime(temporalAverageTime);
        setStandby(temporalStandby);
        setTotalTime(temporalTotalTime);
    }, [tasksDone]);

    return (
        <main className="mainSection">
            <h1 className="TitlePage">Ejemplo visual Algoritmo FIFO</h1>

            <fieldset className="configuration">
                <legend>Configuracion tiempo de ejecucion</legend>
                <label>
                    <input
                        type="radio"
                        name="tiempo"
                        onClick={() => {
                            setTiempo(1000);
                        }}
                        defaultChecked={tiempo == 1000}></input>
                    Segundos
                </label>
                <label>
                    <input
                        type="radio"
                        name="tiempo"
                        onClick={() => {
                            setTiempo(100);
                        }}
                        defaultChecked={tiempo == 100}></input>
                    Segundos * 10^-1
                </label>
            </fieldset>

            <button className="button" onClick={() => createTask()}>
                Crear tarea
            </button>

            <div className="divTables">
                <section className="table">
                    <h2 className="titleSection">Backlog</h2>
                    <ul className="listTask">
                        <li className="titleList">
                            <p>Tarea</p>
                            <p>tamaño</p>
                            <p>Tiempo</p>
                            <p>Estado</p>
                        </li>
                        {tasks.map((task, index) => (
                            <li key={index}>
                                <p>{task.name}</p>
                                <p>{task.size}</p>
                                <p>{task.time}</p>
                                <p>{task.status}</p>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="table">
                    <h2 className="titleSection">Completadas</h2>
                    <ul className="listTask">
                        <li className="titleList">
                            <p>Tarea</p>
                            <p>tamaño</p>
                            <p>Tiempo</p>
                            <p>Estado</p>
                        </li>
                        {tasksDone.map((task, index) => (
                            <li key={index}>
                                <p>{task.name}</p>
                                <p>{task.size}</p>
                                <p>{task.time}</p>
                                <p>{task.status}</p>
                            </li>
                        ))}
                        <li className="resultTime--first">
                            <p>Tiempo promedio en espera:</p>
                            <p>
                                {standby /
                                    (tasksDone.length > 0
                                        ? tasksDone.length
                                        : 1)}
                            </p>
                        </li>
                        <li className="resultTime">
                            <p>Tiempo promedio en ejecucion:</p>
                            <p>
                                {averageTime /
                                    (tasksDone.length > 0
                                        ? tasksDone.length
                                        : 1)}
                            </p>
                        </li>
                        <li className="resultTime">
                            <p>Tiempo promedio en el sistema:</p>
                            <p>
                                {totalTime /
                                    (tasksDone.length > 0
                                        ? tasksDone.length
                                        : 1)}
                            </p>
                        </li>
                    </ul>
                </section>

                <section className="table">
                    <h2 className="titleSection">Canceladas</h2>
                    <ul className="listTask">
                        <li className="titleList">
                            <p>Tarea</p>
                            <p>tamaño</p>
                            <p>Tiempo</p>
                            <p>Estado</p>
                        </li>
                        {tasksCanceled.map((task, index) => (
                            <li key={index}>
                                <p>{task.name}</p>
                                <p>{task.size}</p>
                                <p>{task.time}</p>
                                <p>{task.status}</p>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </main>
    );
}

export default App;
