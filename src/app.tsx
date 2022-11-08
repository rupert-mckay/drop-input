import { useState } from "react";

const FileTable = ({ children: files }: { children: File[] }) =>
	files.length === 0 ? (
		<span>No file uploaded yet</span>
	) : (
		<table>
			<thead>
				<tr>
					<th>File Name</th>
					<th>Last Modified</th>
					<th>Size</th>
					<th>Type</th>
				</tr>
			</thead>
			<tbody>
				{files.map((file) => (
					<tr key={file.name}>
						<td>{file.name}</td>
						<td>{new Date(file.lastModified).toLocaleDateString()}</td>
						<td>{`${file.size.toString()} bytes`}</td>
						<td>{file.type}</td>
					</tr>
				))}
			</tbody>
		</table>
	);

export const App = () => {
	const [files, setFiles] = useState<File[]>([]);

	const onDrop = (dragEvent: React.DragEvent<HTMLInputElement>) => {
		dragEvent.preventDefault();
		setFiles((f) => [...f, ...dragEvent.dataTransfer.files]);
	};

	return (
		<main className="stack center">
			<h1>Drop Input</h1>
			<p>
				This project is a demonstration of native HTML5 drag and drop
				capabilities with file inputs. You can see the source here:{" "}
				<a href="https://github.com/rupert-mckay/drop-input">drop-input</a>
			</p>
			<label htmlFor="input">Drop a file on the button below!</label>
			<input id="input" type="file" onDrop={onDrop}></input>
			<FileTable>{files}</FileTable>
		</main>
	);
};
