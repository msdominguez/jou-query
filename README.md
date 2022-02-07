# Jou Query

http://jou-query.herokuapp.com/

A journal application built with JQuery, Node.js, and MongoDB. Create, view, edit, delete, favorite, and filter journal entries. Designed for iPhone XR.

## /index
* view short summaries of entries sorted in most recent order
* view an entry by clicking on it (navigates to /entry)
* add a new entry (navigates to /upsert-entry)
* update favorite for an entry
* filter entries by year
* filter entries by favorite
* search entries by keyword in any field

## /entry
* view entry
* update favorite
* edit entry (navigates to /upsert-entry)
* delete entry
* view previous and next most recent entries within the selected year

## /upsert-entry
* fill out input fields: time, date, title, song, entry, favorite
* save entry (create new or update existing entry)

## How to Run Locally

1. Clone the repo
2. Run `node server`
3. Navigate to `localhost:1337`
