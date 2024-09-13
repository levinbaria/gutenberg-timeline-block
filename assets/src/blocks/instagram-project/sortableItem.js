import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function SortableItem(props) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: props.id, handle: props.handle });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition: isDragging ? transition : 'none',
		zIndex: isDragging ? 1000 : 'auto',
		backgroundColor: isDragging ? '#fafafa' : 'white',
		border: isDragging ? '1px dashed gray' : '2px solid transparent',
		boxShadow: isDragging ? '0 4px 8px rgba(0,0,0,0.1)' : 'none',
	};

	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners} className={`sortable-item ${isDragging ? 'dragging' : ''}`}>
			{/* Handle for dragging */}
			{props.handle && (
				<div className="handle" {...listeners} {...attributes}>
					<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="M360-160q-33 0-56.5-23.5T280-240q0-33 23.5-56.5T360-320q33 0 56.5 23.5T440-240q0 33-23.5 56.5T360-160Zm240 0q-33 0-56.5-23.5T520-240q0-33 23.5-56.5T600-320q33 0 56.5 23.5T680-240q0 33-23.5 56.5T600-160ZM360-400q-33 0-56.5-23.5T280-480q0-33 23.5-56.5T360-560q33 0 56.5 23.5T440-480q0 33-23.5 56.5T360-400Zm240 0q-33 0-56.5-23.5T520-480q0-33 23.5-56.5T600-560q33 0 56.5 23.5T680-480q0 33-23.5 56.5T600-400ZM360-640q-33 0-56.5-23.5T280-720q0-33 23.5-56.5T360-800q33 0 56.5 23.5T440-720q0 33-23.5 56.5T360-640Zm240 0q-33 0-56.5-23.5T520-720q0-33 23.5-56.5T600-800q33 0 56.5 23.5T680-720q0 33-23.5 56.5T600-640Z" /></svg>
				</div>
			)}
				{props.children}
		</div>
	);
}