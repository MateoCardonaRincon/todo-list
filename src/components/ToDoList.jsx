import { Store } from '/src/components/StoreProvider'
import { useContext, useEffect } from 'react'

const ToDoList = () => {

    // call to the context state and dispatch
    const { state, dispatch } = useContext(Store)


    // Gets all the notes stored in the database before the component is rendered
    // Then, triggers the dispatch, setting these notes as the new listOfNote of the context state
    useEffect(() => {
        let listOfNotes = fetchAllNotes().then(
            notes => {
                let action = {
                    type: "get-notes",
                    payload: notes
                }
                dispatch(action)
            })
    }, [])

    // useEffect callback function to fetch the API with all the notes
    const fetchAllNotes = async () => {
        let response = await fetch("http://localhost:8081/api/get/notes")
        let data = await response.json()
        return data
    }

    // updates a note, by changing the done property depending on the state of the checkbox
    const onCheckbox = async (event, note) => {
        const isChecked = event.currentTarget.checked;

        const noteUpdatedFromForm = { ...note, done: isChecked }

        // promises are treated using async/await and .then() approaches
        let noteUpdated = await fetch("http://localhost:8081/api/update/note", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(noteUpdatedFromForm)
        }).then(response => response.json());

        dispatch({ type: "update-note", payload: noteUpdated })
    }

    // this event triggers the remove-note case in the dispatcher, removing the note by id
    // out of the listOfNotes property of the context state
    const onDelete = async (e, note) => {

        let response = await fetch(`http://localhost:8081/api/delete/note/${note.id}`, { method: "DELETE" });

        // checks if the note was succesfully deleted on the DB, if so, the dispatch is triggered
        if (response.status === 200) {
            dispatch({ type: "remove-note", payload: { ...note } })
        }

    }

    return (
        <div>
            <h1>List of Tasks</h1>
            <ul>
                {state.listOfNotes.map(note => {
                    return <li className={"note " + (note.done ? "checked" : "unchecked")} key={note.id}>
                        <input className="checkbox" type="checkbox" checked={note.done} onChange={(e) => onCheckbox(e, note)} />
                        <h4>{note.title}</h4>
                        <span>{note.message}</span>
                        <button className="delete-btn" onClick={(e) => onDelete(e, note)}>✖</button>
                    </li>
                })}
            </ul>
        </div>
    )
}

export default ToDoList