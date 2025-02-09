var fs = require('fs')

function readFile(path) {
    fs.readFile(path, 'utf8', function(err, data) {
        if(err){
            console.log('Error reading file:', err)
        }
        console.log('File content:', data)
    })
}

readFile('./data.txt')
