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
	inputRef,
	onFilesReceived,
}: {
	dropZoneRef: RefObject<HTMLElement>;
	inputRef?: RefObject<HTMLInputElement>;
	onFilesReceived: (receivedFiles: FileList) => unknown;
}) => {
	const [isDragActive, setIsDragActive] = useState(false);

	// @see https://stackoverflow.com/a/21002544/5177400
	const nestingCounter = useRef(0);

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
			onFilesReceived(dataTransfer.files);
		};
		const onDragOverEventHandler = (e: Event) => {
			e.preventDefault();
			e.stopPropagation();
		};
		const onDragEnterHandler = () => {
			nestingCounter.current += 1;
			setIsDragActive(true);
		};
		const onDragLeaveHandler = () => {
			nestingCounter.current -= 1;
			if (nestingCounter.current === 0) {
				setIsDragActive(false);
			}
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
	}, [dropZoneRef, onFilesReceived]);

	useEffect(() => {
		if (inputRef === undefined || inputRef.current === null) return;
		const inputRefCurrent = inputRef.current;

		const onChangeHandler = (e: Event) => {
			const inputElement = e.currentTarget as HTMLInputElement;
			const targetFiles = inputElement.files;
			if (targetFiles === null) return;
			inputElement.value = "";
			onFilesReceived(targetFiles);
		};

		inputRefCurrent.addEventListener("change", onChangeHandler);

		return () => {
			inputRefCurrent.removeEventListener("change", onChangeHandler);
		};
	}, [inputRef, onFilesReceived]);

	return {
		isDragActive,
	};
};

export const App = () => {
	const [files, setFiles] = useState<File[]>([]);
	const dropZoneRef = useRef<HTMLLabelElement | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);

	const onFilesReceived = (files: FileList) => {
		setFiles((f) => [...f, ...files]);
	};

	const { isDragActive } = useDropZone({
		inputRef,
		onFilesReceived,
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
				className="stack"
				style={{
					minHeight: "10rem",
					border: isDragActive ? "5px solid red" : "1px dashed black",
					display: "flex",
					justifyContent: "space-around",
					padding: "var(--space, 1.5rem)",
				}}
			>
				<span>Drop anywhere in this zone!</span>
				<input
					ref={inputRef}
					style={{ display: "block" }}
					type="file"
					multiple
				/>
			</label>
			<FileTable>{files}</FileTable>
		</main>
	);
};
