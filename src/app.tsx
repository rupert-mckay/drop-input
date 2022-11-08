import { type RefObject, useEffect, useRef, useState } from "react";

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

const useDropZone = ({
	dropZoneRef,
	onDrop,
}: {
	dropZoneRef: RefObject<HTMLElement>;
	onDrop: (receivedFiles: FileList) => unknown;
}) => {
	const [isDragActive, setIsDragActive] = useState(false);

	useEffect(() => {
		if (dropZoneRef.current === null) {
			return;
		}
		const dropZoneRefCurrent = dropZoneRef.current;
		const onDropEventHandler = (event: DragEvent) => {
			event.preventDefault();
			setIsDragActive(false);
			const dataTransfer = event.dataTransfer;
			if (dataTransfer === null) return;
			onDrop(dataTransfer.files);
		};
		const onDragOverEventHandler = (e: Event) => {
			e.preventDefault();
			e.stopPropagation();
		};
		const onDragEnterHandler = () => {
			setIsDragActive(true);
		};
		const onDragLeaveHandler = () => {
			setIsDragActive(false);
		};
		dropZoneRef.current.addEventListener("drop", onDropEventHandler);
		dropZoneRef.current.addEventListener("dragover", onDragOverEventHandler);
		dropZoneRef.current.addEventListener("dragenter", onDragEnterHandler);
		dropZoneRef.current.addEventListener("dragleave", onDragLeaveHandler);

		return () => {
			dropZoneRefCurrent.removeEventListener("drop", onDropEventHandler);
			dropZoneRefCurrent.removeEventListener(
				"dragover",
				onDragOverEventHandler
			);
			dropZoneRefCurrent.removeEventListener("dragenter", onDragEnterHandler);
			dropZoneRefCurrent.removeEventListener("dragleave", onDragLeaveHandler);
		};
	}, [dropZoneRef, onDrop]);

	return {
		isDragActive,
	};
};

export const App = () => {
	const [files, setFiles] = useState<File[]>([]);
	const dropZoneRef = useRef<HTMLLabelElement | null>(null);

	const onFileUpload = (files: FileList) => {
		setFiles((f) => [...f, ...files]);
	};

	const { isDragActive } = useDropZone({
		onDrop: onFileUpload,
		dropZoneRef,
	});

	return (
		<main className="stack center">
			<h1>Drop Input</h1>
			<p>
				This project is a demonstration of native HTML5 drag and drop
				capabilities with file inputs. You can see the source here:{" "}
				<a href="https://github.com/rupert-mckay/drop-input">drop-input</a>
			</p>
			<label
				ref={dropZoneRef}
				style={{
					minHeight: "10rem",
					border: isDragActive ? "5px solid red" : "1px dashed black",
				}}
			>
				Drop anywhere in this zone!
				<input
					style={{ display: "block" }}
					type="file"
					onDrop={(e) => onFileUpload(e.dataTransfer.files)}
					onChange={(e) => {
						const targetFiles = e.currentTarget.files;
						if (targetFiles === null) return;
						onFileUpload(targetFiles);
					}}
				/>
			</label>
			<FileTable>{files}</FileTable>
		</main>
	);
};
