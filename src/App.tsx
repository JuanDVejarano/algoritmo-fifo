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

    const [tasks, setTasks] = useState<taskInterface[]>([]);

    const [tasksDone, setTasksDone] = useState<taskInterface[]>([]);
    const [tasksCanceled, setTasksCanceled] = useState<taskInterface[]>([]);
    let [taskID, setTaskID] = useState(0);

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
                setTasksDone([...tasksDone, temporalTasks[0]]);
                temporalTasks.shift();

                if (temporalTasks.length > 0) {
                    temporalTasks[0].status = "en ejecucion";
                }

                setTasks(temporalTasks);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [tasks]);

    return (
        <main className="mainSection">
            <button className="button" onClick={() => createTask()}>
                {" "}
                Crear tarea
            </button>

            <div className="divTables">
                <section className="table">
                    <h2 className="titleSection">Backlog</h2>
                    <ul className="listTask">
                        <li className="titleList">
                            <p>Nombre Tarea</p>
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
                            <p>Nombre Tarea</p>
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
                    </ul>
                </section>

                <section className="table">
                    <h2 className="titleSection">Canceladas</h2>
                    <ul className="listTask">
                        <li className="titleList">
                            <p>Nombre Tarea</p>
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
