import * as fs from "node:fs"
import * as path from "node:path"


const getAllFiles = (directory: fs.PathLike, foldersOnly: boolean = false) => {
    let fileNames = []

    const files = fs.readdirSync(directory, { withFileTypes: true })

    for (const file of files) {
        const filePath = path.join(directory as string, file.name)

        if (foldersOnly) {
            if (file.isDirectory()) {
                fileNames.push(filePath);
            }
        } else {
            if (file.isFile()) {
                fileNames.push(filePath)
            }
        }
    }

    return fileNames;
}

export default getAllFiles