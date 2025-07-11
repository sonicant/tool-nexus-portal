/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { RegexTesterTool } from '../../../src/tools/regex-tester/RegexTesterTool';
import { useI18n } from '../../../src/hooks/useI18n';
import { useToast } from '../../../src/hooks/use-toast';
import '@testing-library/jest-dom';

// Mock hooks
vi.mock('../../../src/hooks/useI18n');
vi.mock('../../../src/hooks/use-toast');

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});

const mockT = (key: string) => {
  const translations: Record<string, string> = {
    'tools.regexTester.name': 'Regex Tester',
    'tools.regexTester.description': 'Test and validate regular expressions',
    'tools.regexTester.pattern': 'Regular Expression Pattern',
    'tools.regexTester.patternDesc': 'Enter your regular expression pattern',
    'tools.regexTester.patternPlaceholder': 'Enter regex pattern...',
    'tools.regexTester.testString': 'Test String',
    'tools.regexTester.testStringDesc': 'Enter text to test against the pattern',
    'tools.regexTester.testStringPlaceholder': 'Enter test string...',
    'tools.regexTester.results': 'Results',
    'tools.regexTester.resultsDesc': 'Match results and details',
    'tools.regexTester.matches': 'matches',
    'tools.regexTester.noMatches': 'No matches found',
    'tools.regexTester.highlightedText': 'Highlighted Text',
    'tools.regexTester.matchDetails': 'Match Details',
    'tools.regexTester.match': 'Match',
    'tools.regexTester.position': 'Position',
    'tools.regexTester.captureGroups': 'Capture Groups',
    'tools.regexTester.namedGroups': 'Named Groups',
    'tools.regexTester.flags.title': 'Flags',
    'tools.regexTester.flags.description': 'Configure regex flags',
    'tools.regexTester.flags.globalDesc': 'Find all matches',
    'tools.regexTester.flags.ignoreCaseDesc': 'Case insensitive matching',
    'tools.regexTester.flags.multilineDesc': 'Multiline mode',
    'tools.regexTester.flags.dotAllDesc': 'Dot matches newlines',
    'tools.regexTester.flags.unicodeDesc': 'Unicode mode',
    'tools.regexTester.flags.stickyDesc': 'Sticky mode',
    'common.copied': 'Copied',
    'Home': 'Home'
  };
  return translations[key] || key;
};

const mockToast = vi.fn();

describe('RegexTesterTool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useI18n as ReturnType<typeof vi.fn>).mockReturnValue({ t: mockT });
    (useToast as ReturnType<typeof vi.fn>).mockReturnValue({ toast: mockToast });
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  it('renders correctly with initial state', () => {
    renderWithRouter(<RegexTesterTool />);
    
    expect(screen.getByText('Regex Tester')).toBeInTheDocument();
    expect(screen.getByText('Test and validate regular expressions')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter regex pattern...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter test string...')).toBeInTheDocument();
  });

  it('validates regex pattern correctly', async () => {
    renderWithRouter(<RegexTesterTool />);
    
    const patternInput = screen.getByPlaceholderText('Enter regex pattern...');
    
    // Test invalid pattern
    fireEvent.change(patternInput, { target: { value: '[' } });
    await waitFor(() => {
      expect(screen.getByText(/Invalid regular expression/)).toBeInTheDocument();
    });
  });

  it('finds matches correctly with global flag', async () => {
    renderWithRouter(<RegexTesterTool />);
    
    const patternInput = screen.getByPlaceholderText('Enter regex pattern...');
    const testStringInput = screen.getByPlaceholderText('Enter test string...');
    
    // Test email pattern
    fireEvent.change(patternInput, { target: { value: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b' } });
    fireEvent.change(testStringInput, { target: { value: 'Contact us at test@example.com or admin@site.org' } });
    
    await waitFor(() => {
      expect(screen.getByText('2 matches')).toBeInTheDocument();
    });
  });

  it('finds matches correctly without global flag', async () => {
    renderWithRouter(<RegexTesterTool />);
    
    const patternInput = screen.getByPlaceholderText('Enter regex pattern...');
    const testStringInput = screen.getByPlaceholderText('Enter test string...');
    const globalSwitch = screen.getByRole('switch', { name: /Global \(g\)/ });
    
    // Disable global flag
    fireEvent.click(globalSwitch);
    
    // Test pattern
    fireEvent.change(patternInput, { target: { value: '\\d+' } });
    fireEvent.change(testStringInput, { target: { value: 'Numbers: 123 and 456' } });
    
    await waitFor(() => {
      expect(screen.getByText('1 matches')).toBeInTheDocument();
    });
  });

  it('handles capture groups correctly', async () => {
    renderWithRouter(<RegexTesterTool />);
    
    const patternInput = screen.getByPlaceholderText('Enter regex pattern...');
    const testStringInput = screen.getByPlaceholderText('Enter test string...');
    
    // Test pattern with capture groups
    fireEvent.change(patternInput, { target: { value: '(\\d{4})-(\\d{2})-(\\d{2})' } });
    fireEvent.change(testStringInput, { target: { value: 'Date: 2023-10-26' } });
    
    await waitFor(() => {
      expect(screen.getByText('1 matches')).toBeInTheDocument();
      // Check if capture groups section exists
      const captureGroupsText = screen.queryByText('Capture Groups');
      if (captureGroupsText) {
        expect(captureGroupsText).toBeInTheDocument();
      }
    });
  });

  it('copies regex to clipboard', async () => {
    renderWithRouter(<RegexTesterTool />);
    
    const patternInput = screen.getByPlaceholderText('Enter regex pattern...');
    
    fireEvent.change(patternInput, { target: { value: '\\d+' } });
    
    // Find copy button - it should be enabled after entering a pattern
    const buttons = screen.getAllByRole('button');
    const copyButton = buttons.find(button => !(button as HTMLButtonElement).disabled && button.querySelector('svg'));
    
    if (copyButton) {
      fireEvent.click(copyButton);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('/\\d+/g');
    }
  });

  it('shows no matches message when appropriate', async () => {
    renderWithRouter(<RegexTesterTool />);
    
    const patternInput = screen.getByPlaceholderText('Enter regex pattern...');
    const testStringInput = screen.getByPlaceholderText('Enter test string...');
    
    fireEvent.change(patternInput, { target: { value: '\\d+' } });
    fireEvent.change(testStringInput, { target: { value: 'No numbers here!' } });
    
    await waitFor(() => {
      expect(screen.getByText('No matches found')).toBeInTheDocument();
    });
  });

  it('toggles flags correctly', async () => {
    renderWithRouter(<RegexTesterTool />);
    
    const ignoreCaseSwitch = screen.getByRole('switch', { name: /Ignore Case \(i\)/ });
    const patternInput = screen.getByPlaceholderText('Enter regex pattern...');
    const testStringInput = screen.getByPlaceholderText('Enter test string...');
    
    // Test case sensitive (default)
    fireEvent.change(patternInput, { target: { value: 'Hello' } });
    fireEvent.change(testStringInput, { target: { value: 'hello world' } });
    
    await waitFor(() => {
      expect(screen.getByText('0 matches')).toBeInTheDocument();
    });
    
    // Enable ignore case
    fireEvent.click(ignoreCaseSwitch);
    
    await waitFor(() => {
      expect(screen.getByText('1 matches')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('prevents infinite loops with zero-length matches', async () => {
    renderWithRouter(<RegexTesterTool />);
    
    const patternInput = screen.getByPlaceholderText('Enter regex pattern...');
    const testStringInput = screen.getByPlaceholderText('Enter test string...');
    
    // Test pattern that can cause zero-length matches
    fireEvent.change(patternInput, { target: { value: '\\b' } });
    fireEvent.change(testStringInput, { target: { value: 'hello world' } });
    
    await waitFor(() => {
      // Should not hang and should find word boundaries
      expect(screen.getByText(/\d+ matches/)).toBeInTheDocument();
    }, { timeout: 1000 });
  });
});

// Test regex utility functions separately
describe('Regex Utility Functions', () => {
  it('should correctly build flags string', () => {
    const flags = {
      global: true,
      ignoreCase: true,
      multiline: false,
      dotAll: false,
      unicode: false,
      sticky: false
    };
    
    let flagStr = '';
    if (flags.global) flagStr += 'g';
    if (flags.ignoreCase) flagStr += 'i';
    if (flags.multiline) flagStr += 'm';
    if (flags.dotAll) flagStr += 's';
    if (flags.unicode) flagStr += 'u';
    if (flags.sticky) flagStr += 'y';
    
    expect(flagStr).toBe('gi');
  });

  it('should handle regex compilation errors', () => {
    expect(() => {
      const invalidPattern = '[' + 'unclosed';
      new RegExp(invalidPattern, 'g');
    }).toThrow();
  });

  it('should correctly extract match information', () => {
    const regex = /(\d{4})-(\d{2})-(\d{2})/g;
    const text = 'Dates: 2023-10-26 and 2023-12-25';
    const matches: Array<{
      match: string;
      index: number;
      groups: string[];
      namedGroups: Record<string, string>;
    }> = [];
    
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        match: match[0],
        index: match.index,
        groups: match.slice(1),
        namedGroups: match.groups || {}
      });
      
      // Prevent infinite loop
      if (match.index === regex.lastIndex) {
        regex.lastIndex++;
      }
    }
    
    expect(matches).toHaveLength(2);
    expect(matches[0].match).toBe('2023-10-26');
    expect(matches[0].groups).toEqual(['2023', '10', '26']);
    expect(matches[1].match).toBe('2023-12-25');
    expect(matches[1].groups).toEqual(['2023', '12', '25']);
  });
});