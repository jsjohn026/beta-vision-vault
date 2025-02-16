import './style.css'
import { PROJECT_ID, DATABASE_ID, COLLECTION_ID } from "./shhh";
import { Client, Databases, ID } from "appwrite";

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID);

const databases = new Databases(client);
const form = document.querySelector('form')

form.addEventListener('submit', addVision)

function addVision(e) {
  e.preventDefault()
  const vision = databases.createDocument(
    DATABASE_ID,
    COLLECTION_ID,
    ID.unique(),
    { "app-name": e.target.appName.value,
      "date-added": e.target.dateAdded.value,
      "purpose": e.target.purpose.value,
      "features": e.target.features.value
    }
  )
  vision.then(function (response) {
    addVisionsToDom()
  }, function (error) {
    console.log(error)
  })
  form.reset()
}

async function addVisionsToDom(){
  document.querySelector('ul').innerHTML = ""
  let response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTION_ID,    
  )
  console.log(response.documents[0])
  response.documents.forEach(vision => {
    const li = document.createElement('li')
    li.id = vision.$id
    const visionName = document.createElement('h4')
    visionName.textContent = `${vision['app-name']}`
    visionName.className = 'vision-title'

    const span = document.createElement('span')
    span.innerHTML = `Purpose: <br> ${vision.purpose}`
    
    const paragraph = document.createElement('p')
    paragraph.innerHTML = `Features: <br> ${vision.features}`

    const deleteBtn = document.createElement('button')
    deleteBtn.textContent = '🧨'
    deleteBtn.onclick = () => removeVision(vision.$id)
    li.appendChild(visionName)
    li.appendChild(span)
    li.appendChild(paragraph)
    li.appendChild(deleteBtn)

    document.querySelector('ul').appendChild(li)

  });

  async function removeVision(id) {
    const result = await databases.deleteDocument(
      DATABASE_ID,
      COLLECTION_ID,
      id
    )
    document.getElementById(id).remove()
    // result.then(() => location.reload())
  }
}

addVisionsToDom()