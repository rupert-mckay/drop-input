import React, { useState } from "react";

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

const useDropZone = <T extends Element>({
	onDrop,
}: {
	onDrop: (dragEvent: React.DragEvent<T>) => unknown;
}) => {
	const [isDragActive, setIsDragActive] = useState(false)

	return {
		getProps: () => ({
			onDrop: (e: React.DragEvent<T>) => {
				e.preventDefault();
				setIsDragActive(false);
				onDrop(e);
			},
			onDragOver: (e: React.DragEvent<T>) => {
				e.preventDefault();
				e.stopPropagation();
			},
			onDragEnter: () => { setIsDragActive(true) },
			onDragLeave: () => { setIsDragActive(false) },
		}),
		isDragActive
	}
};

export const App = () => {
	const [files, setFiles] = useState<File[]>([]);

	const onDrop = (dragEvent: React.DragEvent) => {
		setFiles((f) => [...f, ...dragEvent.dataTransfer.files]);
	};

	const { isDragActive, getProps } = useDropZone({ onDrop });

	return (
		<main className="stack center">
			<h1>Drop Input</h1>
			<p>
				This project is a demonstration of native HTML5 drag and drop
				capabilities with file inputs. You can see the source here:{" "}
				<a href="https://github.com/rupert-mckay/drop-input">drop-input</a>
			</p>
			<label
				style={{ minHeight: "10rem", border: isDragActive ? "5px solid red" : "1px dashed black" }}
				{...getProps()}
			>
				Drop anywhere in this zone!
				<input style={{ display: "block" }} type="file" onDrop={onDrop} />
			</label>
			<FileTable>{files}</FileTable>
		</main>
	);
};
