
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FilePreview from '../FilePreview';
import { PostAttachment } from '../types';

// Mock framer-motion to avoid animation-related issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('FilePreview', () => {
  const mockOnRemove = vi.fn();

  const createMockAttachment = (type: string, name: string): PostAttachment => ({
    file: new File([""], name, { type }),
    preview: "test-url"
  });

  beforeEach(() => {
    mockOnRemove.mockClear();
  });

  it('renders image files correctly', () => {
    const mockFiles = [
      createMockAttachment('image/jpeg', 'test-image.jpg')
    ];

    render(<FilePreview files={mockFiles} onRemove={mockOnRemove} />);
    
    const image = screen.getByAltText('test-image.jpg');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test-url');
  });

  it('renders non-image files correctly', () => {
    const mockFiles = [
      createMockAttachment('application/pdf', 'test-doc.pdf')
    ];

    render(<FilePreview files={mockFiles} onRemove={mockOnRemove} />);
    
    const filename = screen.getByText('test-doc.pdf');
    expect(filename).toBeInTheDocument();
  });

  it('handles file removal', () => {
    const mockFiles = [
      createMockAttachment('image/jpeg', 'test-image.jpg')
    ];

    render(<FilePreview files={mockFiles} onRemove={mockOnRemove} />);
    
    const removeButton = screen.getByRole('button');
    fireEvent.click(removeButton);
    
    expect(mockOnRemove).toHaveBeenCalledWith(0);
    expect(mockOnRemove).toHaveBeenCalledTimes(1);
  });

  it('renders multiple files', () => {
    const mockFiles = [
      createMockAttachment('image/jpeg', 'test-image.jpg'),
      createMockAttachment('application/pdf', 'test-doc.pdf')
    ];

    render(<FilePreview files={mockFiles} onRemove={mockOnRemove} />);
    
    expect(screen.getByAltText('test-image.jpg')).toBeInTheDocument();
    expect(screen.getByText('test-doc.pdf')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('renders empty state when no files are provided', () => {
    render(<FilePreview files={[]} onRemove={mockOnRemove} />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('preserves accessibility attributes', () => {
    const mockFiles = [
      createMockAttachment('image/jpeg', 'test-image.jpg')
    ];

    render(<FilePreview files={mockFiles} onRemove={mockOnRemove} />);
    
    const removeButton = screen.getByRole('button');
    expect(removeButton).toHaveClass('group-hover:opacity-100'); // Checking hover state class
  });
});

